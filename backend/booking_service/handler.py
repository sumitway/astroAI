"""
Booking Service Lambda Handler
Manages astrologer profiles, availability, and session bookings.
Uses DynamoDB for storage.
"""

import json
import os
import sys
import uuid
from datetime import datetime, timedelta
from typing import List, Optional

import boto3
from botocore.exceptions import ClientError
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext
from mangum import Mangum
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

logger = Logger()
tracer = Tracer()

app = FastAPI(title="Booking Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# DynamoDB tables
DYNAMODB_REGION = os.environ.get('AWS_REGION', 'us-east-1')
ASTROLOGERS_TABLE = os.environ.get('ASTROLOGERS_TABLE', 'jyotish-astrologers')
BOOKINGS_TABLE = os.environ.get('BOOKINGS_TABLE', 'jyotish-bookings')
SLOTS_TABLE = os.environ.get('SLOTS_TABLE', 'jyotish-slots')

dynamodb = boto3.resource('dynamodb', region_name=DYNAMODB_REGION)


# ─── Models ───────────────────────────────────────────────────────────────────

class AstrologerProfile(BaseModel):
    id: str
    name: str
    title: str
    specialties: List[str]
    experience: int
    rating: float
    review_count: int
    price_per_session: float
    languages: List[str]
    available: bool
    next_available: str
    bio: str
    qualifications: List[str]
    avatar_url: Optional[str] = None


class BookingRequest(BaseModel):
    astrologer_id: str
    date: str
    slot_time: str
    duration_minutes: int
    consultation_type: str  # 'video' | 'voice' | 'chat'
    topic: str
    user_id: str
    user_name: str
    user_email: str


class BookingResponse(BaseModel):
    booking_id: str
    meeting_link: Optional[str] = None
    confirmation_code: str
    scheduled_at: str
    status: str


class SlotInfo(BaseModel):
    date: str
    slots: List[str]


# ─── Mock Data (fallback if DynamoDB is unavailable) ─────────────────────────

MOCK_ASTROLOGERS = [
    AstrologerProfile(
        id='1',
        name='Pt. Rajesh Sharma',
        title='Jyotish Acharya',
        specialties=['Vedic Astrology', 'Vastu', 'Muhurta'],
        experience=25, rating=4.9, review_count=1240,
        price_per_session=50.0,
        languages=['Hindi', 'English'],
        available=True,
        next_available='Today, 3:00 PM',
        bio='25 years of experience in Vedic astrology, Vastu Shastra, and Muhurta calculation.',
        qualifications=['Jyotish Acharya (Varanasi)', 'Vastu Visharad'],
    ),
    AstrologerProfile(
        id='2',
        name='Dr. Sunita Patel',
        title='Vedic Astrologer & Numerologist',
        specialties=['KP Astrology', 'Numerology', 'Palmistry'],
        experience=18, rating=4.8, review_count=856,
        price_per_session=40.0,
        languages=['Gujarati', 'Hindi', 'English'],
        available=True,
        next_available='Today, 5:30 PM',
        bio='Combines KP Astrology with Numerology for precise predictions.',
        qualifications=['PhD Astrology', 'KP Stellar Astrology Certificate'],
    ),
]


def get_astrologers_from_db(specialty: Optional[str] = None) -> List[AstrologerProfile]:
    try:
        table = dynamodb.Table(ASTROLOGERS_TABLE)
        if specialty:
            response = table.scan(
                FilterExpression='contains(specialties, :s)',
                ExpressionAttributeValues={':s': specialty},
            )
        else:
            response = table.scan()

        return [AstrologerProfile(**item) for item in response.get('Items', [])]
    except ClientError as e:
        logger.warning(f"DynamoDB error, using mock data: {e}")
        if specialty:
            return [a for a in MOCK_ASTROLOGERS if specialty in a.specialties]
        return MOCK_ASTROLOGERS


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get('/astrologers', response_model=List[AstrologerProfile])
@tracer.capture_method
def list_astrologers(
    specialty: Optional[str] = Query(default=None),
    language: Optional[str] = Query(default=None),
) -> List[AstrologerProfile]:
    astrologers = get_astrologers_from_db(specialty)
    if language:
        astrologers = [a for a in astrologers if language in a.languages]
    return astrologers


@app.get('/astrologers/{astrologer_id}', response_model=AstrologerProfile)
@tracer.capture_method
def get_astrologer(astrologer_id: str = Path(...)) -> AstrologerProfile:
    try:
        table = dynamodb.Table(ASTROLOGERS_TABLE)
        response = table.get_item(Key={'id': astrologer_id})
        item = response.get('Item')
        if not item:
            # Try mock
            mock = next((a for a in MOCK_ASTROLOGERS if a.id == astrologer_id), None)
            if mock:
                return mock
            raise HTTPException(status_code=404, detail='Astrologer not found')
        return AstrologerProfile(**item)
    except ClientError:
        mock = next((a for a in MOCK_ASTROLOGERS if a.id == astrologer_id), None)
        if mock:
            return mock
        raise HTTPException(status_code=404, detail='Astrologer not found')


@app.get('/astrologers/{astrologer_id}/slots', response_model=List[SlotInfo])
@tracer.capture_method
def get_available_slots(
    astrologer_id: str = Path(...),
    start_date: str = Query(...),
    end_date: str = Query(...),
) -> List[SlotInfo]:
    """Return available time slots for the given date range."""
    try:
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')

        slots = []
        current = start
        while current <= end:
            # Generate mock slots (9 AM to 7 PM, every 30 min, skipping busy)
            day_slots = []
            for hour in range(9, 19):
                for minute in [0, 30]:
                    slot_time = f'{hour:02d}:{minute:02d}'
                    # Mock: skip some slots to simulate bookings
                    if not (hour == 12 and minute == 0) and not (hour == 15 and minute == 30):
                        day_slots.append(f'{slot_time} {"AM" if hour < 12 else "PM"}')

            slots.append(SlotInfo(date=current.strftime('%Y-%m-%d'), slots=day_slots))
            current += timedelta(days=1)

        return slots
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f'Invalid date format: {e}')


@app.post('/bookings', response_model=BookingResponse)
@tracer.capture_method
def create_booking(request: BookingRequest) -> BookingResponse:
    booking_id = str(uuid.uuid4())
    confirmation_code = booking_id[:8].upper()
    scheduled_at = f'{request.date}T{request.slot_time}'

    # Generate meeting link for video consultations
    meeting_link = None
    if request.consultation_type == 'video':
        meeting_link = f'https://meet.jyotishai.com/session/{booking_id}'

    booking_item = {
        'booking_id': booking_id,
        'astrologer_id': request.astrologer_id,
        'user_id': request.user_id,
        'user_name': request.user_name,
        'user_email': request.user_email,
        'date': request.date,
        'slot_time': request.slot_time,
        'duration_minutes': request.duration_minutes,
        'consultation_type': request.consultation_type,
        'topic': request.topic,
        'meeting_link': meeting_link,
        'confirmation_code': confirmation_code,
        'scheduled_at': scheduled_at,
        'status': 'confirmed',
        'created_at': datetime.utcnow().isoformat(),
    }

    try:
        table = dynamodb.Table(BOOKINGS_TABLE)
        table.put_item(Item=booking_item)
    except ClientError as e:
        logger.warning(f"DynamoDB booking save failed: {e}")
        # Continue anyway — return the booking response

    # TODO: Send confirmation email via SES
    # TODO: Send SMS via SNS
    # TODO: Create calendar event via Google/Outlook API

    return BookingResponse(
        booking_id=booking_id,
        meeting_link=meeting_link,
        confirmation_code=confirmation_code,
        scheduled_at=scheduled_at,
        status='confirmed',
    )


@app.get('/bookings/my', response_model=List[dict])
@tracer.capture_method
def get_user_bookings(user_id: str = Query(...)) -> List[dict]:
    try:
        table = dynamodb.Table(BOOKINGS_TABLE)
        response = table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :uid',
            ExpressionAttributeValues={':uid': user_id},
        )
        return response.get('Items', [])
    except ClientError as e:
        logger.error(f"Get bookings error: {e}")
        return []


@app.delete('/bookings/{booking_id}')
@tracer.capture_method
def cancel_booking(booking_id: str = Path(...)) -> dict:
    try:
        table = dynamodb.Table(BOOKINGS_TABLE)
        table.update_item(
            Key={'booking_id': booking_id},
            UpdateExpression='SET #s = :cancelled',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':cancelled': 'cancelled'},
        )
        return {'message': 'Booking cancelled successfully'}
    except ClientError as e:
        logger.error(f"Cancel booking error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


handler = Mangum(app, lifespan="off")


@logger.inject_lambda_context
def lambda_handler(event: dict, context: LambdaContext) -> dict:
    return handler(event, context)
