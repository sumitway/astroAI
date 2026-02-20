/**
 * Home Screen — Jyotish AI
 * Shows: today's panchanga summary, current dasha, birth chart mini preview,
 * daily insight (AI), and quick action cards.
 */

import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  useWindowDimensions, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';
import { SouthIndianChart } from '@components/charts/SouthIndianChart';
import { useAppSelector } from '@store/hooks';
import type { ChartData } from '@components/charts/SouthIndianChart';

// Sample chart data — will come from Redux store / API in production
const SAMPLE_CHART: ChartData = {
  ascendant: 4, // Cancer
  chartType: 'D1',
  planets: [
    { planet: 'sun',     sign: 4,  degree: 12, isRetrograde: false },
    { planet: 'moon',    sign: 10, degree: 22, isRetrograde: false },
    { planet: 'mars',    sign: 6,  degree: 8,  isRetrograde: false },
    { planet: 'mercury', sign: 5,  degree: 28, isRetrograde: true  },
    { planet: 'jupiter', sign: 1,  degree: 15, isRetrograde: false },
    { planet: 'venus',   sign: 3,  degree: 5,  isRetrograde: false },
    { planet: 'saturn',  sign: 11, degree: 19, isRetrograde: true  },
    { planet: 'rahu',    sign: 2,  degree: 11, isRetrograde: true  },
    { planet: 'ketu',    sign: 8,  degree: 11, isRetrograde: true  },
  ],
};

const QUICK_ACTIONS = [
  { icon: '◎', label: 'All Charts',     route: '/charts',    gradient: Colors.gradients.cosmic },
  { icon: '☽', label: 'Panchanga',      route: '/panchanga', gradient: Colors.gradients.moon },
  { icon: '◈', label: 'Ask AI',         route: '/chat',      gradient: Colors.gradients.mystic },
  { icon: '◉', label: 'Book Session',   route: '/booking',   gradient: Colors.gradients.golden },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const chartSize = Math.min(width - 64, 280);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={styles.container}>
      <CosmicBackground starCount={80} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Namaste 🙏</Text>
              <Text style={styles.subtitle}>Your cosmic snapshot today</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.avatarText}>✦</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Highlight Banner */}
          <GlassCard style={styles.highlightBanner} gradient gradientColors={Colors.gradients.cosmic}>
            <Text style={styles.bannerTitle}>Today's Cosmic Snapshot</Text>
            <View style={styles.bannerRow}>
              <PanchangaItem icon="☽" label="Tithi" value="Shukla Panchami" />
              <PanchangaItem icon="✦" label="Nakshatra" value="Rohini" />
              <PanchangaItem icon="♃" label="Yoga" value="Saubhagya" />
            </View>
          </GlassCard>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickAction}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickActionGradient}
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                </LinearGradient>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Birth Chart Preview */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Birth Chart (D1)</Text>
              <TouchableOpacity onPress={() => router.push('/charts')}>
                <Text style={styles.seeAll}>View All →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
              <SouthIndianChart
                data={SAMPLE_CHART}
                size={chartSize}
                showHouseNumbers={true}
                highlightAscendant={true}
                onCellPress={(house, sign) => router.push('/charts')}
              />
            </View>
          </GlassCard>

          {/* Current Dasha */}
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Current Dasha</Text>
            <View style={styles.dashaRow}>
              <DashaPeriod label="Maha Dasha" value="Jupiter" years="16 yrs" color={Colors.planets.jupiter} />
              <DashaPeriod label="Antar Dasha" value="Saturn" years="2.6 yrs" color={Colors.planets.saturn} />
              <DashaPeriod label="Pratyantar" value="Mercury" years="8 mo" color={Colors.planets.mercury} />
            </View>
            <View style={styles.dashaProgress}>
              <View style={styles.dashaProgressBg}>
                <LinearGradient
                  colors={Colors.gradients.cosmic}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.dashaProgressFill, { width: '62%' }]}
                />
              </View>
              <Text style={styles.dashaProgressLabel}>62% complete · 6 yrs 2 mo remaining</Text>
            </View>
          </GlassCard>

          {/* AI Daily Insight */}
          <GlassCard style={styles.sectionCard} gradient gradientColors={['rgba(139,92,246,0.15)', 'rgba(236,72,153,0.08)']}>
            <View style={styles.aiInsightHeader}>
              <Text style={styles.aiInsightIcon}>◈</Text>
              <Text style={styles.sectionTitle}>AI Daily Insight</Text>
            </View>
            <Text style={styles.aiInsightText}>
              With Jupiter transiting your 10th house, this is a powerful period for career advancement.
              Mercury retrograde in Leo may cause some communication delays — review contracts carefully.
              The Rohini nakshatra today enhances creativity and nurturing energy.
            </Text>
            <TouchableOpacity
              style={styles.aiChatBtn}
              onPress={() => router.push('/chat')}
            >
              <Text style={styles.aiChatBtnText}>Ask AI for more insights →</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Active Yogas */}
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Active Yogas</Text>
            <View style={styles.yogasList}>
              <YogaBadge name="Gaja Kesari" type="benefic" description="Jupiter-Moon conjunction" />
              <YogaBadge name="Budha-Aditya" type="benefic" description="Sun-Mercury in same sign" />
              <YogaBadge name="Kemadruma" type="malefic" description="Moon without adjacents" />
            </View>
          </GlassCard>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PanchangaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={subStyles.panchangaItem}>
      <Text style={subStyles.panchangaIcon}>{icon}</Text>
      <Text style={subStyles.panchangaLabel}>{label}</Text>
      <Text style={subStyles.panchangaValue}>{value}</Text>
    </View>
  );
}

function DashaPeriod({ label, value, years, color }: { label: string; value: string; years: string; color: string }) {
  return (
    <View style={subStyles.dashaPeriod}>
      <Text style={subStyles.dashaPeriodLabel}>{label}</Text>
      <Text style={[subStyles.dashaPeriodValue, { color }]}>{value}</Text>
      <Text style={subStyles.dashaPeriodYears}>{years}</Text>
    </View>
  );
}

function YogaBadge({ name, type, description }: { name: string; type: 'benefic' | 'malefic'; description: string }) {
  const color = type === 'benefic' ? Colors.success : Colors.error;
  return (
    <View style={[subStyles.yogaBadge, { borderColor: color + '44' }]}>
      <View style={[subStyles.yogaDot, { backgroundColor: color }]} />
      <View>
        <Text style={[subStyles.yogaName, { color }]}>{name}</Text>
        <Text style={subStyles.yogaDesc}>{description}</Text>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.cosmicVoid },
  safeArea:     { flex: 1 },
  scroll:       { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[4], paddingTop: Spacing[2] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  greeting: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  avatarBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, color: Colors.primary },
  highlightBanner: { marginBottom: Spacing[4] },
  bannerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-around' },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  quickAction: { alignItems: 'center', flex: 1 },
  quickActionGradient: {
    width: 52, height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionIcon: { fontSize: 22, color: Colors.textPrimary },
  quickActionLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionCard: { marginBottom: Spacing[4] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  chartContainer: { alignItems: 'center' },
  dashaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing[3],
  },
  dashaProgress: { gap: 6 },
  dashaProgressBg: {
    height: 4,
    backgroundColor: Colors.glassBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  dashaProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  dashaProgressLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  aiInsightIcon: { fontSize: 20, color: Colors.textPurple },
  aiInsightText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing[3],
  },
  aiChatBtn: { alignSelf: 'flex-start' },
  aiChatBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPurple,
  },
  yogasList: { gap: Spacing[2] },
  bottomPadding: { height: 100 },
});

const subStyles = StyleSheet.create({
  panchangaItem: { alignItems: 'center', flex: 1 },
  panchangaIcon: { fontSize: 20, marginBottom: 2 },
  panchangaLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  panchangaValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  dashaPeriod: { alignItems: 'center', flex: 1 },
  dashaPeriodLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  dashaPeriodValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
  dashaPeriodYears: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 1,
  },
  yogaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.glassSurface,
    borderRadius: 8,
    borderWidth: 1,
    padding: Spacing[2],
  },
  yogaDot: { width: 8, height: 8, borderRadius: 4 },
  yogaName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
  yogaDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
