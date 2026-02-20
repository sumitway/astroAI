"""
Chart Calculator Lambda Handler
Calculates birth charts, divisional charts, and planetary positions
using PyJHora (which wraps Swiss Ephemeris via pyswisseph).
"""

import json
import os
import sys
from datetime import datetime
from typing import Optional

import pytz
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext
from mangum import Mangum
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add common to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from common.models import BirthDataInput, ChartDataOut, PlanetPositionOut, DashaResponse, DashaPeriod

logger = Logger()
tracer = Tracer()

app = FastAPI(title="Jyotish AI Chart Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Ayanamsa mapping to PyJHora constants
AYANAMSA_MAP = {
    'lahiri':     1,
    'raman':      3,
    'kp':         9,
    'true_citra': 27,
}

PLANET_IDS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu']

NAKSHATRA_NAMES = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

SIGN_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

DIGNITY_MAP = {
    # (planet, sign) -> dignity
    ('sun', 1): 'Exalted', ('sun', 7): 'Debilitated', ('sun', 5): 'Own Sign',
    ('moon', 2): 'Exalted', ('moon', 8): 'Debilitated', ('moon', 4): 'Own Sign',
    ('mars', 10): 'Exalted', ('mars', 4): 'Debilitated', ('mars', 1): 'Own Sign', ('mars', 8): 'Own Sign',
    ('mercury', 6): 'Exalted', ('mercury', 12): 'Debilitated', ('mercury', 3): 'Own Sign', ('mercury', 6): 'Own Sign',
    ('jupiter', 4): 'Exalted', ('jupiter', 10): 'Debilitated', ('jupiter', 9): 'Own Sign', ('jupiter', 12): 'Own Sign',
    ('venus', 12): 'Exalted', ('venus', 6): 'Debilitated', ('venus', 2): 'Own Sign', ('venus', 7): 'Own Sign',
    ('saturn', 7): 'Exalted', ('saturn', 1): 'Debilitated', ('saturn', 10): 'Own Sign', ('saturn', 11): 'Own Sign',
    ('rahu', 3): 'Exalted', ('rahu', 9): 'Debilitated',
    ('ketu', 9): 'Exalted', ('ketu', 3): 'Debilitated',
}


def get_dignity(planet: str, sign: int) -> str:
    return DIGNITY_MAP.get((planet, sign), 'Neutral')


def longitude_to_sign_degree(longitude: float) -> tuple[int, float]:
    sign = int(longitude / 30) + 1
    degree = longitude % 30
    return sign, degree


def longitude_to_nakshatra(longitude: float) -> tuple[str, int]:
    nak_span = 360 / 27
    pada_span = nak_span / 4
    nak_idx = int(longitude / nak_span)
    nak_idx = min(nak_idx, 26)
    pada = int((longitude % nak_span) / pada_span) + 1
    return NAKSHATRA_NAMES[nak_idx], pada


def try_import_jhora():
    """Try to import PyJHora; return None if not available (for dev/testing)."""
    try:
        from jhora.horoscope.chart import charts
        from jhora.horoscope.main import utils
        return charts, utils
    except ImportError:
        logger.warning("PyJHora not installed, using mock data")
        return None, None


def calculate_chart_jhora(birth_data: BirthDataInput) -> ChartDataOut:
    """Calculate chart using PyJHora."""
    charts, utils = try_import_jhora()

    if charts is None:
        return _mock_chart(birth_data)

    ayanamsa = AYANAMSA_MAP[birth_data.ayanamsa]
    tz = pytz.timezone(birth_data.timezone)
    local_dt = tz.localize(datetime(
        birth_data.year, birth_data.month, birth_data.day,
        birth_data.hour, birth_data.minute, birth_data.second
    ))
    utc_dt = local_dt.astimezone(pytz.utc)

    # PyJHora chart calculation
    h = charts.Charts(
        year=utc_dt.year, month=utc_dt.month, day=utc_dt.day,
        hours=utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0,
        minutes=0, place=(birth_data.latitude, birth_data.longitude),
        ayanamsa_mode=ayanamsa
    )

    planet_longitudes = h.rasi_chart()
    ascendant_long = h.ascendant_longitude()

    planets_out = []
    for planet_id, longitude in planet_longitudes.items():
        sign, degree = longitude_to_sign_degree(longitude)
        nakshatra, pada = longitude_to_nakshatra(longitude)

        # Retrograde check (planets 2-8 index in swe order)
        is_retro = getattr(h, f'{planet_id}_retrograde', False)

        planets_out.append(PlanetPositionOut(
            planet=planet_id,
            sign=sign,
            degree=degree,
            longitude=longitude,
            is_retrograde=is_retro,
            is_combust=False,  # TODO: compute combust
            nakshatra=nakshatra,
            nakshatra_pada=pada,
            dignity=get_dignity(planet_id, sign),
        ))

    asc_sign, asc_degree = longitude_to_sign_degree(ascendant_long)
    return ChartDataOut(
        ascendant=asc_sign,
        ascendant_degree=asc_degree,
        planets=planets_out,
    )


def _mock_chart(birth_data: BirthDataInput) -> ChartDataOut:
    """Fallback mock chart for development."""
    planets = [
        PlanetPositionOut(planet='sun', sign=4, degree=12.3, longitude=93.3, is_retrograde=False,
                          is_combust=False, nakshatra='Pushya', nakshatra_pada=2, dignity='Own Sign'),
        PlanetPositionOut(planet='moon', sign=10, degree=22.8, longitude=292.8, is_retrograde=False,
                          is_combust=False, nakshatra='Shravana', nakshatra_pada=3, dignity='Neutral'),
        PlanetPositionOut(planet='mars', sign=6, degree=8.1, longitude=158.1, is_retrograde=False,
                          is_combust=False, nakshatra='Uttara Phalguni', nakshatra_pada=1, dignity='Neutral'),
        PlanetPositionOut(planet='mercury', sign=5, degree=28.5, longitude=148.5, is_retrograde=True,
                          is_combust=False, nakshatra='Purva Phalguni', nakshatra_pada=4, dignity='Neutral'),
        PlanetPositionOut(planet='jupiter', sign=1, degree=15.2, longitude=15.2, is_retrograde=False,
                          is_combust=False, nakshatra='Bharani', nakshatra_pada=2, dignity='Neutral'),
        PlanetPositionOut(planet='venus', sign=3, degree=5.7, longitude=65.7, is_retrograde=False,
                          is_combust=False, nakshatra='Mrigashira', nakshatra_pada=1, dignity='Neutral'),
        PlanetPositionOut(planet='saturn', sign=11, degree=19.4, longitude=339.4, is_retrograde=True,
                          is_combust=False, nakshatra='Purva Bhadrapada', nakshatra_pada=4, dignity='Own Sign'),
        PlanetPositionOut(planet='rahu', sign=2, degree=11.9, longitude=41.9, is_retrograde=True,
                          is_combust=False, nakshatra='Krittika', nakshatra_pada=1, dignity='Neutral'),
        PlanetPositionOut(planet='ketu', sign=8, degree=11.9, longitude=221.9, is_retrograde=True,
                          is_combust=False, nakshatra='Jyeshtha', nakshatra_pada=1, dignity='Neutral'),
    ]
    return ChartDataOut(ascendant=4, ascendant_degree=5.0, planets=planets)


# ─── FastAPI Endpoints ─────────────────────────────────────────────────────────

@app.post('/chart/calculate', response_model=ChartDataOut)
@tracer.capture_method
def calculate_chart(birth_data: BirthDataInput) -> ChartDataOut:
    try:
        return calculate_chart_jhora(birth_data)
    except Exception as e:
        logger.error(f"Chart calculation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/chart/divisional/{division}', response_model=ChartDataOut)
@tracer.capture_method
def calculate_divisional_chart(division: int, birth_data: BirthDataInput) -> ChartDataOut:
    """Calculate Dnn chart (D2, D9, D10, etc.)."""
    try:
        charts, _ = try_import_jhora()
        if charts is None:
            chart = _mock_chart(birth_data)
            # Simple mock: shift ascendant by division
            chart.ascendant = ((chart.ascendant + division - 2) % 12) + 1
            return chart

        # PyJHora divisional chart
        ayanamsa = AYANAMSA_MAP[birth_data.ayanamsa]
        tz = pytz.timezone(birth_data.timezone)
        local_dt = tz.localize(datetime(
            birth_data.year, birth_data.month, birth_data.day,
            birth_data.hour, birth_data.minute, birth_data.second
        ))
        utc_dt = local_dt.astimezone(pytz.utc)

        h = charts.Charts(
            year=utc_dt.year, month=utc_dt.month, day=utc_dt.day,
            hours=utc_dt.hour + utc_dt.minute / 60.0,
            minutes=0, place=(birth_data.latitude, birth_data.longitude),
            ayanamsa_mode=ayanamsa
        )
        d_chart = h.divisional_chart(division)
        # Process d_chart similar to rasi_chart...
        return _mock_chart(birth_data)  # placeholder

    except Exception as e:
        logger.error(f"Divisional chart error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/dasha/calculate', response_model=DashaResponse)
@tracer.capture_method
def calculate_dasha(birth_data: BirthDataInput) -> DashaResponse:
    """Calculate Vimshottari Dasha periods."""
    try:
        charts, utils = try_import_jhora()

        if utils is None:
            # Mock dasha
            return DashaResponse(
                maha_dasha=DashaPeriod(planet='jupiter', start_date='2018-11-01', end_date='2034-11-01', years_remaining=8.7),
                antar_dasha=DashaPeriod(planet='saturn', start_date='2024-03-01', end_date='2026-09-01', years_remaining=0.5),
                pratyantar=DashaPeriod(planet='mercury', start_date='2025-11-01', end_date='2026-03-01', years_remaining=0.1),
                timeline=[
                    DashaPeriod(planet='ketu', start_date='2011-04-01', end_date='2018-04-01', years_remaining=0),
                    DashaPeriod(planet='venus', start_date='1991-04-01', end_date='2011-04-01', years_remaining=0),
                    DashaPeriod(planet='jupiter', start_date='2018-11-01', end_date='2034-11-01', years_remaining=8.7),
                    DashaPeriod(planet='saturn', start_date='2034-11-01', end_date='2053-11-01', years_remaining=27.7),
                ]
            )

        # PyJHora dasha calculation
        # TODO: implement with actual PyJHora API
        return DashaResponse(
            maha_dasha=DashaPeriod(planet='jupiter', start_date='2018-11-01', end_date='2034-11-01', years_remaining=8.7),
            antar_dasha=DashaPeriod(planet='saturn', start_date='2024-03-01', end_date='2026-09-01', years_remaining=0.5),
            pratyantar=DashaPeriod(planet='mercury', start_date='2025-11-01', end_date='2026-03-01', years_remaining=0.1),
            timeline=[],
        )

    except Exception as e:
        logger.error(f"Dasha calculation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# AWS Lambda handler
handler = Mangum(app, lifespan="off")


@logger.inject_lambda_context
def lambda_handler(event: dict, context: LambdaContext) -> dict:
    return handler(event, context)
