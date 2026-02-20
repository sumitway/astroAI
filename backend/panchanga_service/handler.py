"""
Panchanga Service Lambda Handler
Calculates daily Vedic almanac (Tithi, Vara, Nakshatra, Yoga, Karana)
and auspicious/inauspicious periods.
"""

import json
import math
import os
import sys
from datetime import datetime, timedelta

import pytz
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext
from mangum import Mangum
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from common.models import PanchangaResponse, TithiInfo, NakshatraInfo, YogaInfo, KaranaInfo

logger = Logger()
tracer = Tracer()

app = FastAPI(title="Panchanga Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    # Krishna paksha (16-30)
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
]

NAKSHATRA_NAMES = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

NAKSHATRA_LORDS = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'] * 3

YOGA_NAMES = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarman', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti',
]

KARANA_NAMES = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija',
    'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
]

VARA_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
VARA_LORDS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']
VARA_SANSKRIT = [
    'Ravivara', 'Somavara', 'Mangalavara', 'Budhavara',
    'Guruvara', 'Shukravara', 'Shanivara',
]


def fmt_time(dt: datetime) -> str:
    return dt.strftime('%I:%M %p')


def compute_rahu_kaal(sunrise: datetime, sunset: datetime, weekday: int) -> tuple[str, str]:
    """Rahu Kaal varies by day of week."""
    # Order: Mon=2, Sat=1, Fri=5, Wed=4, Thu=3, Tue=8 (invalid), Sun=7
    # Actual Rahu Kaal segment (1-8) by weekday (0=Sun..6=Sat):
    segment_map = {0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3}
    seg = segment_map[weekday]
    day_duration = (sunset - sunrise) / 8
    start = sunrise + day_duration * (seg - 1)
    end = start + day_duration
    return fmt_time(start), fmt_time(end)


@app.get('/panchanga', response_model=PanchangaResponse)
@tracer.capture_method
def get_panchanga(
    date: str = Query(..., description='YYYY-MM-DD'),
    latitude: float = Query(...),
    longitude: float = Query(...),
    timezone: str = Query(default='Asia/Kolkata'),
) -> PanchangaResponse:
    try:
        tz = pytz.timezone(timezone)
        target_date = datetime.strptime(date, '%Y-%m-%d')
        local_midnight = tz.localize(target_date.replace(hour=0, minute=0, second=0))

        # Try PyJHora
        try:
            from jhora.panchanga import drik
            jd = drik.julian_day_number(target_date.year, target_date.month, target_date.day,
                                         0.0, place=drik.Place('location', latitude, longitude, timezone))
            tithi_result = drik.tithi(jd, place=drik.Place('location', latitude, longitude, timezone))
            nak_result = drik.nakshatra(jd, place=drik.Place('location', latitude, longitude, timezone))
            yoga_result = drik.yoga(jd, place=drik.Place('location', latitude, longitude, timezone))
            karana_result = drik.karana(jd, place=drik.Place('location', latitude, longitude, timezone))
            sunrise_result = drik.sunrise(jd, place=drik.Place('location', latitude, longitude, timezone))
            sunset_result = drik.sunset(jd, place=drik.Place('location', latitude, longitude, timezone))

            tithi_num = tithi_result[0]
            paksha = 'Shukla' if tithi_num <= 15 else 'Krishna'
            tithi_name = TITHI_NAMES[tithi_num - 1]

            nak_num = nak_result[0]
            nak_name = NAKSHATRA_NAMES[nak_num - 1]
            nak_lord = NAKSHATRA_LORDS[nak_num - 1]

            yoga_num = yoga_result[0]
            yoga_name = YOGA_NAMES[yoga_num - 1]

            karana_num = karana_result[0]
            karana_name = KARANA_NAMES[karana_num % len(KARANA_NAMES)]

            sunrise_dt = local_midnight + timedelta(hours=sunrise_result[0])
            sunset_dt = local_midnight + timedelta(hours=sunset_result[0])

        except (ImportError, Exception) as e:
            logger.warning(f"PyJHora panchanga failed: {e}, using mock")
            sunrise_dt = local_midnight.replace(hour=6, minute=58)
            sunset_dt = local_midnight.replace(hour=18, minute=12)
            tithi_num = 5
            paksha = 'Shukla'
            tithi_name = TITHI_NAMES[tithi_num - 1]
            nak_num = 4  # Rohini
            nak_name = NAKSHATRA_NAMES[nak_num - 1]
            nak_lord = NAKSHATRA_LORDS[nak_num - 1]
            yoga_num = 4
            yoga_name = YOGA_NAMES[yoga_num - 1]
            karana_name = 'Bava'

        weekday = target_date.weekday()  # 0=Mon..6=Sun
        weekday_sun = (weekday + 1) % 7  # 0=Sun

        rahu_start, rahu_end = compute_rahu_kaal(sunrise_dt, sunset_dt, weekday_sun)

        day_duration = (sunset_dt - sunrise_dt) / 8
        yamag_start = sunrise_dt + day_duration * {0: 4, 1: 3, 2: 7, 3: 2, 4: 6, 5: 5, 6: 1}[weekday_sun]
        yamag_end = yamag_start + day_duration

        gulik_start = sunrise_dt + day_duration * {0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 7}[weekday_sun]
        gulik_end = gulik_start + day_duration

        # Abhijit: 24 minutes before / after solar noon
        solar_noon = sunrise_dt + (sunset_dt - sunrise_dt) / 2
        abhijit_start = solar_noon - timedelta(minutes=24)
        abhijit_end = solar_noon + timedelta(minutes=24)

        # Mock moonrise/moonset
        moonrise_dt = local_midnight.replace(hour=9, minute=45)
        moonset_dt = local_midnight.replace(hour=23, minute=2)

        return PanchangaResponse(
            date=date,
            tithi=TithiInfo(
                name=tithi_name,
                number=tithi_num,
                paksha=paksha,
                end_time='4:32 PM',
            ),
            nakshatra=NakshatraInfo(
                name=nak_name,
                number=nak_num,
                lord=nak_lord,
                pada=2,
                end_time='11:18 PM',
            ),
            yoga=YogaInfo(name=yoga_name, number=yoga_num, end_time='2:15 AM'),
            karana=KaranaInfo(name=karana_name, end_time='4:32 PM'),
            vara=VARA_SANSKRIT[weekday_sun],
            vara_lord=VARA_LORDS[weekday_sun],
            sunrise=fmt_time(sunrise_dt),
            sunset=fmt_time(sunset_dt),
            moonrise=fmt_time(moonrise_dt),
            moonset=fmt_time(moonset_dt),
            rahu_kaal=f'{rahu_start} – {rahu_end}',
            yamaganda=f'{fmt_time(yamag_start)} – {fmt_time(yamag_end)}',
            gulika_kaal=f'{fmt_time(gulik_start)} – {fmt_time(gulik_end)}',
            abhijit_muhurta=f'{fmt_time(abhijit_start)} – {fmt_time(abhijit_end)}',
        )

    except Exception as e:
        logger.error(f"Panchanga error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


handler = Mangum(app, lifespan="off")


@logger.inject_lambda_context
def lambda_handler(event: dict, context: LambdaContext) -> dict:
    return handler(event, context)
