/**
 * RTK Query API slice
 * Connects to the Python Lambda backend via AWS API Gateway.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import type { ChartData } from '@components/charts/SouthIndianChart';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:8000';

// ─── Request / Response Types ─────────────────────────────────────────────────

export interface BirthDataInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  latitude: number;
  longitude: number;
  timezone: string;   // e.g. 'Asia/Kolkata'
  ayanamsa?: string;  // 'lahiri' (default) | 'raman' | 'kp'
}

export interface PlanetPosition {
  planet: string;
  sign: number;
  degree: number;
  longitude: number;  // absolute 0-360
  isRetrograde: boolean;
  isCombust: boolean;
  nakshatra: string;
  nakshatraPada: number;
  dignity: string;
  shadbala?: number;
}

export interface ChartResponse {
  ascendant: number;
  ascendantDegree: number;
  planets: PlanetPosition[];
  divisionalCharts: Record<string, { ascendant: number; planets: PlanetPosition[] }>;
}

export interface DashaResponse {
  mahaDasha: DashaPeriod;
  antarDasha: DashaPeriod;
  pratyantar: DashaPeriod;
  timeline: DashaPeriod[];
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  yearsRemaining: number;
}

export interface PanchangaResponse {
  date: string;
  tithi: { name: string; number: number; paksha: string; endTime: string };
  nakshatra: { name: string; number: number; lord: string; pada: number; endTime: string };
  yoga: { name: string; number: number; endTime: string };
  karana: { name: string; endTime: string };
  vara: string;
  varaLord: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
}

export interface YogaResponse {
  yogas: Array<{ name: string; type: 'benefic' | 'malefic' | 'neutral'; description: string; planets: string[] }>;
  doshas: Array<{ name: string; severity: 'high' | 'medium' | 'low'; description: string; remedies: string[] }>;
}

export interface AIChatRequest {
  message: string;
  chartData?: ChartData;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AIChatResponse {
  message: string;
  followUpQuestions?: string[];
}

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  languages: string[];
  available: boolean;
  nextAvailable: string;
  bio: string;
  qualifications: string[];
}

export interface BookingRequest {
  astrologerId: string;
  date: string;  // ISO 8601
  duration: 30 | 60 | 90;
  consultationType: 'video' | 'voice' | 'chat';
  topic: string;
  birthData: BirthDataInput;
}

export interface BookingResponse {
  bookingId: string;
  meetingLink?: string;
  confirmationCode: string;
  scheduledAt: string;
}

// ─── API Definition ────────────────────────────────────────────────────────────

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add Cognito JWT from store
      const state = getState() as any;
      const token = state.user?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Chart', 'Dasha', 'Panchanga', 'Astrologer', 'Booking'],
  endpoints: builder => ({
    // Chart calculation
    calculateChart: builder.query<ChartResponse, BirthDataInput>({
      query: (birthData) => ({
        url: '/chart/calculate',
        method: 'POST',
        body: birthData,
      }),
      providesTags: ['Chart'],
    }),

    // Divisional chart
    getDivisionalChart: builder.query<ChartResponse, { birthData: BirthDataInput; division: number }>({
      query: ({ birthData, division }) => ({
        url: `/chart/divisional/${division}`,
        method: 'POST',
        body: birthData,
      }),
    }),

    // Dasha calculation
    calculateDasha: builder.query<DashaResponse, BirthDataInput>({
      query: (birthData) => ({
        url: '/dasha/calculate',
        method: 'POST',
        body: birthData,
      }),
      providesTags: ['Dasha'],
    }),

    // Daily panchanga
    getPanchanga: builder.query<PanchangaResponse, { date: string; latitude: number; longitude: number }>({
      query: (params) => ({ url: '/panchanga', params }),
      providesTags: ['Panchanga'],
    }),

    // Yogas and doshas
    analyzeYogas: builder.query<YogaResponse, BirthDataInput>({
      query: (birthData) => ({
        url: '/analysis/yogas',
        method: 'POST',
        body: birthData,
      }),
    }),

    // AI Chat
    sendChatMessage: builder.mutation<AIChatResponse, AIChatRequest>({
      query: (request) => ({
        url: '/ai/chat',
        method: 'POST',
        body: request,
      }),
    }),

    // Astrologers
    getAstrologers: builder.query<Astrologer[], { specialty?: string; language?: string }>({
      query: (params) => ({ url: '/astrologers', params }),
      providesTags: ['Astrologer'],
    }),

    getAstrologer: builder.query<Astrologer, string>({
      query: (id) => `/astrologers/${id}`,
      providesTags: (_, __, id) => [{ type: 'Astrologer', id }],
    }),

    getAstrologerSlots: builder.query<
      Array<{ date: string; slots: string[] }>,
      { astrologerId: string; startDate: string; endDate: string }
    >({
      query: ({ astrologerId, ...params }) => ({
        url: `/astrologers/${astrologerId}/slots`,
        params,
      }),
    }),

    // Bookings
    createBooking: builder.mutation<BookingResponse, BookingRequest>({
      query: (request) => ({
        url: '/bookings',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Booking'],
    }),

    getUserBookings: builder.query<BookingResponse[], void>({
      query: () => '/bookings/my',
      providesTags: ['Booking'],
    }),

    cancelBooking: builder.mutation<void, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useCalculateChartQuery,
  useGetDivisionalChartQuery,
  useCalculateDashaQuery,
  useGetPanchangaQuery,
  useAnalyzeYogasQuery,
  useSendChatMessageMutation,
  useGetAstrologersQuery,
  useGetAstrologerQuery,
  useGetAstrologerSlotsQuery,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useCancelBookingMutation,
} = api;
