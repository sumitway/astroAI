"""
Shared Pydantic models for all Lambda functions.
"""

from __future__ import annotations
from typing import Optional, List, Dict, Literal
from pydantic import BaseModel, Field


class BirthDataInput(BaseModel):
    year: int
    month: int = Field(ge=1, le=12)
    day: int = Field(ge=1, le=31)
    hour: int = Field(ge=0, le=23)
    minute: int = Field(ge=0, le=59)
    second: int = Field(default=0, ge=0, le=59)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    timezone: str = Field(default='Asia/Kolkata')
    ayanamsa: Literal['lahiri', 'raman', 'kp', 'true_citra'] = 'lahiri'


class PlanetPositionOut(BaseModel):
    planet: str
    sign: int = Field(ge=1, le=12)
    degree: float
    longitude: float  # 0-360
    is_retrograde: bool
    is_combust: bool
    nakshatra: str
    nakshatra_pada: int = Field(ge=1, le=4)
    dignity: str
    shadbala: Optional[float] = None


class ChartDataOut(BaseModel):
    ascendant: int = Field(ge=1, le=12)
    ascendant_degree: float
    planets: List[PlanetPositionOut]


class DashaPeriod(BaseModel):
    planet: str
    start_date: str  # ISO 8601
    end_date: str
    years_remaining: float


class DashaResponse(BaseModel):
    maha_dasha: DashaPeriod
    antar_dasha: DashaPeriod
    pratyantar: DashaPeriod
    timeline: List[DashaPeriod]


class TithiInfo(BaseModel):
    name: str
    number: int
    paksha: str  # 'Shukla' | 'Krishna'
    end_time: str


class NakshatraInfo(BaseModel):
    name: str
    number: int
    lord: str
    pada: int
    end_time: str


class YogaInfo(BaseModel):
    name: str
    number: int
    end_time: str


class KaranaInfo(BaseModel):
    name: str
    end_time: str


class PanchangaResponse(BaseModel):
    date: str
    tithi: TithiInfo
    nakshatra: NakshatraInfo
    yoga: YogaInfo
    karana: KaranaInfo
    vara: str
    vara_lord: str
    sunrise: str
    sunset: str
    moonrise: str
    moonset: str
    rahu_kaal: str
    yamaganda: str
    gulika_kaal: str
    abhijit_muhurta: str


class YogaDetail(BaseModel):
    name: str
    type: Literal['benefic', 'malefic', 'neutral']
    description: str
    planets: List[str]


class DoshaDetail(BaseModel):
    name: str
    severity: Literal['high', 'medium', 'low']
    description: str
    remedies: List[str]


class YogaDoshaResponse(BaseModel):
    yogas: List[YogaDetail]
    doshas: List[DoshaDetail]


class ChatMessage(BaseModel):
    role: Literal['user', 'assistant']
    content: str


class AIChatRequest(BaseModel):
    message: str
    chart_data: Optional[ChartDataOut] = None
    birth_data: Optional[BirthDataInput] = None
    history: List[ChatMessage] = Field(default_factory=list)
    session_id: Optional[str] = None


class AIChatResponse(BaseModel):
    message: str
    session_id: str
    follow_up_questions: List[str] = Field(default_factory=list)
