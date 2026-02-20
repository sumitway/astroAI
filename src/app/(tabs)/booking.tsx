/**
 * Booking Screen
 * Browse astrologers, view availability, and book consultations.
 * Integrates with calendar for appointment management.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';
import { TabSelector } from '@components/ui/TabSelector';

const BOOKING_TABS = [
  { key: 'find', label: 'Find Astrologer' },
  { key: 'my', label: 'My Bookings' },
];

interface Astrologer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  languages: string[];
  available: boolean;
  nextAvailable: string;
  avatar: string;
  tags: string[];
}

const ASTROLOGERS: Astrologer[] = [
  {
    id: '1',
    name: 'Pt. Rajesh Sharma',
    title: 'Jyotish Acharya',
    specialties: ['Vedic Astrology', 'Vastu', 'Muhurta'],
    experience: 25,
    rating: 4.9,
    reviewCount: 1240,
    price: 50,
    currency: 'USD',
    languages: ['Hindi', 'English'],
    available: true,
    nextAvailable: 'Today, 3:00 PM',
    avatar: '🔮',
    tags: ['Marriage', 'Career', 'Health'],
  },
  {
    id: '2',
    name: 'Dr. Sunita Patel',
    title: 'Vedic Astrologer & Numerologist',
    specialties: ['KP Astrology', 'Numerology', 'Palmistry'],
    experience: 18,
    rating: 4.8,
    reviewCount: 856,
    price: 40,
    currency: 'USD',
    languages: ['Gujarati', 'Hindi', 'English'],
    available: true,
    nextAvailable: 'Today, 5:30 PM',
    avatar: '✦',
    tags: ['Finance', 'Relationships', 'Career'],
  },
  {
    id: '3',
    name: 'Pandit Krishnamurthy',
    title: 'South Indian Astrology Expert',
    specialties: ['Tamil Jyotish', 'Prasna', 'Nadijyotish'],
    experience: 30,
    rating: 4.95,
    reviewCount: 2100,
    price: 75,
    currency: 'USD',
    languages: ['Tamil', 'Telugu', 'English'],
    available: false,
    nextAvailable: 'Tomorrow, 10:00 AM',
    avatar: '☽',
    tags: ['Nadi Reading', 'Remedies', 'Spiritual'],
  },
  {
    id: '4',
    name: 'Astro Priya Menon',
    title: 'Modern Vedic Astrologer',
    specialties: ['Psychological Astrology', 'Yoga Analysis', 'Prediction'],
    experience: 12,
    rating: 4.7,
    reviewCount: 423,
    price: 35,
    currency: 'USD',
    languages: ['Malayalam', 'English'],
    available: true,
    nextAvailable: 'Today, 7:00 PM',
    avatar: '◈',
    tags: ['Psychology', 'Life Purpose', 'Relationships'],
  },
];

const MY_BOOKINGS = [
  {
    id: 'b1',
    astrologerName: 'Pt. Rajesh Sharma',
    date: 'Feb 22, 2026',
    time: '3:00 PM IST',
    duration: '60 min',
    type: 'Video Call',
    status: 'upcoming',
    topic: 'Career & Finance Reading',
  },
  {
    id: 'b2',
    astrologerName: 'Dr. Sunita Patel',
    date: 'Jan 15, 2026',
    time: '5:00 PM IST',
    duration: '30 min',
    type: 'Voice Call',
    status: 'completed',
    topic: 'Marriage Compatibility',
  },
];

const FILTER_TAGS = ['All', 'Marriage', 'Career', 'Health', 'Finance', 'Spiritual', 'Remedies'];

export default function BookingScreen() {
  const [activeTab, setActiveTab] = useState('find');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredAstros = selectedFilter === 'All'
    ? ASTROLOGERS
    : ASTROLOGERS.filter(a => a.tags.includes(selectedFilter));

  return (
    <View style={styles.container}>
      <CosmicBackground starCount={50} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consultations</Text>
          <Text style={styles.headerSub}>Connect with expert astrologers</Text>
        </View>

        <View style={styles.tabContainer}>
          <TabSelector
            tabs={BOOKING_TABS}
            activeKey={activeTab}
            onSelect={setActiveTab}
            variant="pills"
          />
        </View>

        {activeTab === 'find' && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Search & Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterRow}
            >
              {FILTER_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.filterChip, selectedFilter === tag && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(tag)}
                >
                  <Text style={[styles.filterChipText, selectedFilter === tag && styles.filterChipTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Astrologer Cards */}
            {filteredAstros.map(astro => (
              <AstrologerCard
                key={astro.id}
                astrologer={astro}
                onBook={() => router.push(`/booking/${astro.id}` as any)}
                onProfile={() => router.push(`/astrologer/${astro.id}` as any)}
              />
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}

        {activeTab === 'my' && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {MY_BOOKINGS.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
            {MY_BOOKINGS.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>◉</Text>
                <Text style={styles.emptyTitle}>No bookings yet</Text>
                <Text style={styles.emptyText}>
                  Browse our expert astrologers and book your first consultation
                </Text>
              </View>
            )}
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function AstrologerCard({ astrologer, onBook, onProfile }:
  { astrologer: Astrologer; onBook: () => void; onProfile: () => void }) {
  return (
    <GlassCard style={styles.astroCard}>
      <TouchableOpacity onPress={onProfile} activeOpacity={0.85}>
        <View style={styles.astroHeader}>
          <View style={styles.astroAvatarWrap}>
            <Text style={styles.astroAvatarText}>{astrologer.avatar}</Text>
          </View>
          <View style={styles.astroInfo}>
            <View style={styles.astroNameRow}>
              <Text style={styles.astroName}>{astrologer.name}</Text>
              {astrologer.available && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>Live</Text>
                </View>
              )}
            </View>
            <Text style={styles.astroTitle}>{astrologer.title}</Text>
            <View style={styles.astroRatingRow}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>{astrologer.rating}</Text>
              <Text style={styles.reviewCount}>({astrologer.reviewCount} reviews)</Text>
              <Text style={styles.experience}>· {astrologer.experience} yrs exp</Text>
            </View>
          </View>
        </View>

        <View style={styles.specialtyRow}>
          {astrologer.specialties.slice(0, 3).map(s => (
            <View key={s} style={styles.specialtyChip}>
              <Text style={styles.specialtyText}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.langRow}>
          <Text style={styles.langLabel}>Languages: </Text>
          <Text style={styles.langValue}>{astrologer.languages.join(', ')}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.astroFooter}>
        <View>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.price}>${astrologer.price} / session</Text>
          <Text style={styles.nextAvail}>
            {astrologer.available ? '🟢' : '🕐'} {astrologer.nextAvailable}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, !astrologer.available && styles.bookBtnDisabled]}
          onPress={onBook}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={astrologer.available ? Colors.gradients.golden : ['#555', '#666']}
            style={styles.bookBtnGradient}
          >
            <Text style={styles.bookBtnText}>
              {astrologer.available ? 'Book Now' : 'Schedule'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

function BookingCard({ booking }: { booking: typeof MY_BOOKINGS[0] }) {
  const isUpcoming = booking.status === 'upcoming';
  return (
    <GlassCard style={[styles.bookingCard, isUpcoming && styles.bookingCardUpcoming]}>
      <View style={styles.bookingHeader}>
        <View style={[styles.bookingStatusDot, { backgroundColor: isUpcoming ? Colors.success : Colors.textMuted }]} />
        <Text style={[styles.bookingStatus, { color: isUpcoming ? Colors.success : Colors.textMuted }]}>
          {isUpcoming ? 'Upcoming' : 'Completed'}
        </Text>
      </View>
      <Text style={styles.bookingAstro}>{booking.astrologerName}</Text>
      <Text style={styles.bookingTopic}>{booking.topic}</Text>
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingDetail}>📅 {booking.date} · {booking.time}</Text>
        <Text style={styles.bookingDetail}>⏱ {booking.duration} · {booking.type}</Text>
      </View>
      {isUpcoming && (
        <View style={styles.bookingActions}>
          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>Join Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rescheduleBtn}>
            <Text style={styles.rescheduleBtnText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.cosmicVoid },
  safeArea:     { flex: 1 },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  headerSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tabContainer: {
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  scroll:       { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[4] },
  filterScroll: { marginBottom: Spacing[3] },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    paddingBottom: Spacing[1],
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassSurface,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },
  filterChipText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  astroCard:    { marginBottom: Spacing[3] },
  astroHeader: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  astroAvatarWrap: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1.5,
    borderColor: Colors.primary + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  astroAvatarText: { fontSize: 26 },
  astroInfo: { flex: 1 },
  astroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  astroName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  availableBadge: {
    backgroundColor: Colors.success + '33',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.success + '55',
  },
  availableText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.success,
  },
  astroTitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  astroRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  starIcon: { fontSize: 12, color: Colors.textGold },
  ratingText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textGold,
  },
  reviewCount: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  experience: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[1],
    marginBottom: Spacing[2],
  },
  specialtyChip: {
    backgroundColor: Colors.primaryDim,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  specialtyText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.primary,
  },
  langRow: {
    flexDirection: 'row',
    marginBottom: Spacing[3],
  },
  langLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  langValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  astroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing[3],
  },
  priceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textGold,
  },
  nextAvail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bookBtn: {},
  bookBtnDisabled: { opacity: 0.7 },
  bookBtnGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.cosmicVoid,
  },
  bookingCard:  { marginBottom: Spacing[3] },
  bookingCardUpcoming: { borderColor: Colors.primary + '55' },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  bookingStatusDot: { width: 8, height: 8, borderRadius: 4 },
  bookingStatus: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingAstro: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  bookingTopic: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  bookingDetails: { gap: 4, marginBottom: Spacing[3] },
  bookingDetail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing[3],
  },
  joinBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  rescheduleBtn: {
    flex: 1,
    backgroundColor: Colors.glassSurface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  rescheduleBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: Spacing[3],
  },
  emptyIcon: { fontSize: 48, opacity: 0.4 },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  bottomPadding: { height: 100 },
});
