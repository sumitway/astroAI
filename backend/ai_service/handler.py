"""
AI Chat Service Lambda Handler
Uses Anthropic Claude API to answer Vedic astrology questions
with chart context awareness.
"""

import json
import os
import sys
import uuid
from typing import Optional

import boto3
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext
from mangum import Mangum
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import anthropic

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from common.models import AIChatRequest, AIChatResponse, ChatMessage

logger = Logger()
tracer = Tracer()

app = FastAPI(title="Jyotish AI Chat Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Initialize Anthropic client
anthropic_client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY', ''))

SYSTEM_PROMPT = """You are Jyotish AI, an expert Vedic astrology assistant with deep knowledge of:

1. **Birth Chart Analysis**: Lagna (Ascendant), planetary positions, house lords, aspects
2. **Divisional Charts**: All Varga charts from D1 to D60 and their interpretations
3. **Dasha Systems**: Vimshottari, Yogini, and other dasha calculations
4. **Nakshatras**: All 27 lunar mansions with their padas, lords, and meanings
5. **Yogas**: Raj Yogas, Dhana Yogas, Vipreet Raj Yoga, Panch Mahapurush Yogas, etc.
6. **Doshas**: Mangal Dosha, Kaal Sarp Dosha, Pitru Dosha, Shrapit Dosha, etc.
7. **Panchanga**: Tithi, Vara, Nakshatra, Yoga, Karana and their daily significance
8. **Ashtakavarga**: Bhinna and Sarvashtakavarga analysis
9. **Transit Analysis**: Gochara (transit) effects on birth chart
10. **Remedies**: Gemstones, mantras, yantras, fasting, charity recommendations
11. **Compatibility**: Kundali matching (Ashtakoot and Dashakoot methods)
12. **Medical Astrology**: Health indications from the chart

Guidelines:
- Explain complex concepts in simple, clear language
- Always relate insights to the specific birth chart data provided
- Be compassionate and constructive — focus on potential and remedies
- Use Sanskrit terms with English explanations
- Provide practical, actionable guidance
- Acknowledge uncertainty where calculations need verification
- Never make alarming predictions about health or death
- Suggest professional consultation for medical or legal matters

Format responses with:
- Clear headings using **bold**
- Bullet points for lists
- Specific house/sign/planet references
- Practical takeaways
"""

FOLLOW_UP_QUESTIONS = {
    'career': [
        'What career path does my 10th house suggest?',
        'Which planets support my professional growth?',
        'Are there any career yogas in my chart?',
    ],
    'marriage': [
        'When is a good time for marriage according to my dasha?',
        'What qualities should I look for in a partner?',
        'Is there Mangal Dosha in my chart?',
    ],
    'health': [
        'Which planets affect my health in this dasha?',
        'What are the health remedies for my chart?',
        'How does my 6th house influence my wellbeing?',
    ],
    'spiritual': [
        'What is my spiritual path according to my chart?',
        'Which mantras are best for my nakshatra?',
        'How can I strengthen my chart spiritually?',
    ],
}


def build_chart_context(request: AIChatRequest) -> str:
    """Build a text description of the chart for the AI context."""
    if not request.chart_data:
        return ""

    chart = request.chart_data
    context_lines = [
        f"\n## User's Chart Data:",
        f"- Ascendant (Lagna): House {chart.ascendant} ({get_sign_name(chart.ascendant)})",
        f"- Ascendant Degree: {chart.ascendant_degree:.1f}°",
        "\n### Planetary Positions:",
    ]

    for planet in chart.planets:
        status = '℞' if planet.is_retrograde else ('Combust' if planet.is_combust else 'Direct')
        house = ((planet.sign - chart.ascendant + 12) % 12) + 1
        context_lines.append(
            f"- {planet.planet.capitalize()}: {get_sign_name(planet.sign)} "
            f"({planet.degree:.1f}°) in House {house} | "
            f"Nakshatra: {planet.nakshatra} Pada {planet.nakshatra_pada} | "
            f"{planet.dignity} | {status}"
        )

    return '\n'.join(context_lines)


def get_sign_name(sign_num: int) -> str:
    signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ]
    return signs[(sign_num - 1) % 12]


def detect_topic(message: str) -> str:
    """Detect the primary topic for follow-up suggestions."""
    message_lower = message.lower()
    if any(w in message_lower for w in ['career', 'job', 'profession', 'business', 'work']):
        return 'career'
    if any(w in message_lower for w in ['marriage', 'spouse', 'partner', 'relationship', 'love']):
        return 'marriage'
    if any(w in message_lower for w in ['health', 'disease', 'medical', 'sick', 'body']):
        return 'health'
    if any(w in message_lower for w in ['spiritual', 'karma', 'mantra', 'remedy', 'dosha']):
        return 'spiritual'
    return 'spiritual'


@app.post('/ai/chat', response_model=AIChatResponse)
@tracer.capture_method
async def chat(request: AIChatRequest) -> AIChatResponse:
    session_id = request.session_id or str(uuid.uuid4())

    chart_context = build_chart_context(request)
    system_with_context = SYSTEM_PROMPT + chart_context

    # Build message history
    messages = []
    for msg in request.history[-10:]:  # Last 10 messages for context window
        messages.append({
            'role': msg.role,
            'content': msg.content,
        })
    messages.append({'role': 'user', 'content': request.message})

    try:
        response = anthropic_client.messages.create(
            model='claude-opus-4-6',
            max_tokens=1024,
            system=system_with_context,
            messages=messages,
        )

        ai_message = response.content[0].text

        topic = detect_topic(request.message)
        follow_ups = FOLLOW_UP_QUESTIONS.get(topic, [])[:3]

        return AIChatResponse(
            message=ai_message,
            session_id=session_id,
            follow_up_questions=follow_ups,
        )

    except anthropic.AuthenticationError:
        logger.error("Anthropic API key invalid")
        raise HTTPException(status_code=500, detail="AI service configuration error")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited, please try again")
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


handler = Mangum(app, lifespan="off")


@logger.inject_lambda_context
def lambda_handler(event: dict, context: LambdaContext) -> dict:
    return handler(event, context)
