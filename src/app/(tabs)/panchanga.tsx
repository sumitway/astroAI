/**
 * Panchanga Screen
 * Daily astrological almanac: Tithi, Vara, Nakshatra, Yoga, Karana,
 * planetary hora, auspicious/inauspicious times, moon phase.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';
import { TabSelector } from '@components/ui/TabSelector';

const PANCHANGA_TABS = [
  { key: 'today', label: "Today" },
  { key: 'week', label: "This Week" },
  { key: 'muhurta', label: "Muhurta" },
  { key: 'transit', label: "Transits" },
];

// Mock data — will come from API in production
const TODAY_PANCHANGA = {
  date: 'Wednesday, February 19, 2026',
  samvat: 'Vikram Samvat 2082',
  masa: 'Magha (Shukla Paksha)',
  vara: 'Budhavara (Wednesday)',
  varaLord: 'Mercury',
  tithi: { name: 'Panchami', number: 5, paksha: 'Shukla', endTime: '4:32 PM' },
  nakshatra: { name: 'Rohini', number: 4, lord: 'Moon', pada: 2, endTime: '11:18 PM' },
  yoga: { name: 'Saubhagya', number: 4, endTime: '2:15 AM+1' },
  karana: { name: 'Bava', endTime: '4:32 PM' },
  sunrise: '6:58 AM',
  sunset: '6:12 PM',
  moonrise: '9:45 AM',
  moonset: '11:02 PM',
  moonPhase: 0.35, // 0-1 fraction
  rahuKaal: '12:00 PM – 1:30 PM',
  yamaganda: '7:30 AM – 9:00 AM',
  gulikaKaal: '10:30 AM – 12:00 PM',
  abhijitMuhurta: '12:04 PM – 12:52 PM',
};

const HORA_SCHEDULE = [
  { time: '6:58 AM', hora: 'Sun', color: Colors.planets.sun },
  { time: '7:58 AM', hora: 'Venus', color: Colors.planets.venus },
  { time: '8:58 AM', hora: 'Mercury', color: Colors.planets.mercury },
  { time: '9:58 AM', hora: 'Moon', color: Colors.planets.moon },
  { time: '10:58 AM', hora: 'Saturn', color: Colors.planets.saturn },
  { time: '11:58 AM', hora: 'Jupiter', color: Colors.planets.jupiter },
  { time: '12:58 PM', hora: 'Mars', color: Colors.planets.mars },
  { time: '1:58 PM', hora: 'Sun', color: Colors.planets.sun },
  { time: '2:58 PM', hora: 'Venus', color: Colors.planets.venus },
  { time: '3:58 PM', hora: 'Mercury', color: Colors.planets.mercury },
  { time: '4:58 PM', hora: 'Moon', color: Colors.planets.moon },
  { time: '5:58 PM', hora: 'Saturn', color: Colors.planets.saturn },
];

export default function PanchangaScreen() {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <View style={styles.container}>
      <CosmicBackground starCount={60} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Panchanga</Text>
          <Text style={styles.headerSub}>{TODAY_PANCHANGA.date}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TabSelector
            tabs={PANCHANGA_TABS}
            activeKey={activeTab}
            onSelect={setActiveTab}
            scrollable
            variant="underline"
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'today' && <TodayPanchanga />}
          {activeTab === 'week' && <WeekView />}
          {activeTab === 'muhurta' && <MuhurtaView />}
          {activeTab === 'transit' && <TransitView />}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function TodayPanchanga() {
  return (
    <>
      {/* Samvat Banner */}
      <GlassCard style={styles.samvatCard} gradient gradientColors={Colors.gradients.moon}>
        <Text style={styles.samvatText}>{TODAY_PANCHANGA.samvat}</Text>
        <Text style={styles.masaText}>{TODAY_PANCHANGA.masa}</Text>
      </GlassCard>

      {/* Five Limbs */}
      <Text style={styles.sectionLabel}>Pancha Anga (Five Limbs)</Text>
      <View style={styles.fiveGrid}>
        <PanchangaLimb
          number="1" title="Vara" subtitle="Day" icon="☀"
          main={TODAY_PANCHANGA.vara}
          sub={`Lord: ${TODAY_PANCHANGA.varaLord}`}
          color={Colors.planets.sun}
        />
        <PanchangaLimb
          number="2" title="Tithi" subtitle="Lunar Day" icon="☽"
          main={`${TODAY_PANCHANGA.tithi.paksha} ${TODAY_PANCHANGA.tithi.name} (${TODAY_PANCHANGA.tithi.number})`}
          sub={`Ends: ${TODAY_PANCHANGA.tithi.endTime}`}
          color={Colors.planets.moon}
        />
        <PanchangaLimb
          number="3" title="Nakshatra" subtitle="Lunar Mansion" icon="✦"
          main={`${TODAY_PANCHANGA.nakshatra.name} (${TODAY_PANCHANGA.nakshatra.number})`}
          sub={`Pada ${TODAY_PANCHANGA.nakshatra.pada} · Lord: ${TODAY_PANCHANGA.nakshatra.lord}`}
          color={Colors.textGold}
        />
        <PanchangaLimb
          number="4" title="Yoga" subtitle="Auspiciousness" icon="◎"
          main={`${TODAY_PANCHANGA.yoga.name} (${TODAY_PANCHANGA.yoga.number})`}
          sub={`Ends: ${TODAY_PANCHANGA.yoga.endTime}`}
          color={Colors.success}
        />
        <PanchangaLimb
          number="5" title="Karana" subtitle="Half-Tithi" icon="◈"
          main={TODAY_PANCHANGA.karana.name}
          sub={`Ends: ${TODAY_PANCHANGA.karana.endTime}`}
          color={Colors.info}
        />
      </View>

      {/* Sun / Moon Times */}
      <GlassCard style={styles.timesCard}>
        <Text style={styles.cardTitle}>Sun & Moon Times</Text>
        <View style={styles.timesGrid}>
          <TimeItem icon="☀" label="Sunrise" value={TODAY_PANCHANGA.sunrise} color={Colors.planets.sun} />
          <TimeItem icon="☀" label="Sunset" value={TODAY_PANCHANGA.sunset} color={Colors.planets.sun} />
          <TimeItem icon="☽" label="Moonrise" value={TODAY_PANCHANGA.moonrise} color={Colors.planets.moon} />
          <TimeItem icon="☽" label="Moonset" value={TODAY_PANCHANGA.moonset} color={Colors.planets.moon} />
        </View>
      </GlassCard>

      {/* Inauspicious Periods */}
      <GlassCard style={styles.inauspCard}>
        <Text style={styles.cardTitle}>Inauspicious Periods</Text>
        <InausCard label="Rahu Kaal" time={TODAY_PANCHANGA.rahuKaal} severity="high" />
        <InausCard label="Yamaganda" time={TODAY_PANCHANGA.yamaganda} severity="medium" />
        <InausCard label="Gulika Kaal" time={TODAY_PANCHANGA.gulikaKaal} severity="medium" />
        <View style={[styles.inausDivider, { borderTopColor: Colors.success + '44', borderTopWidth: 1, marginTop: 6 }]} />
        <InausCard label="Abhijit Muhurta" time={TODAY_PANCHANGA.abhijitMuhurta} severity="auspicious" />
      </GlassCard>

      {/* Planetary Hora */}
      <GlassCard style={styles.horaCard}>
        <Text style={styles.cardTitle}>Planetary Hora (Today)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horaRow}>
            {HORA_SCHEDULE.map((h, i) => (
              <View key={i} style={[styles.horaItem, { borderColor: h.color + '44' }]}>
                <Text style={[styles.horaName, { color: h.color }]}>{h.hora}</Text>
                <Text style={styles.horaTime}>{h.time}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </GlassCard>
    </>
  );
}

function WeekView() {
  return (
    <GlassCard>
      <Text style={styles.cardTitle}>Weekly Panchanga</Text>
      <Text style={styles.comingSoon}>Weekly view coming soon — API integration pending</Text>
    </GlassCard>
  );
}

function MuhurtaView() {
  const muhurtas = [
    { name: 'Vivah (Marriage)', icon: '💍', status: 'good', days: 'Feb 22, Mar 5, Mar 12' },
    { name: 'Graha Pravesh', icon: '🏠', status: 'good', days: 'Feb 25, Mar 8' },
    { name: 'Naamkaran', icon: '✦', status: 'neutral', days: 'Feb 20, Feb 27' },
    { name: 'Vehicle Purchase', icon: '🚗', status: 'good', days: 'Feb 21, Feb 28' },
    { name: 'Travel', icon: '✈', status: 'caution', days: 'Feb 19 (avoid Rahu Kaal)' },
  ];

  return (
    <GlassCard>
      <Text style={styles.cardTitle}>Auspicious Muhurtas</Text>
      {muhurtas.map(m => (
        <View key={m.name} style={styles.muhurtaRow}>
          <Text style={styles.muhurtaIcon}>{m.icon}</Text>
          <View style={styles.muhurtaInfo}>
            <Text style={styles.muhurtaName}>{m.name}</Text>
            <Text style={styles.muhurtaDays}>{m.days}</Text>
          </View>
          <View style={[styles.muhurtaStatus, {
            backgroundColor: m.status === 'good' ? Colors.success + '33'
              : m.status === 'caution' ? Colors.warning + '33'
              : Colors.glassSurface,
          }]}>
            <Text style={[styles.muhurtaStatusText, {
              color: m.status === 'good' ? Colors.success
                : m.status === 'caution' ? Colors.warning
                : Colors.textMuted,
            }]}>
              {m.status === 'good' ? '✓ Good' : m.status === 'caution' ? '! Caution' : 'Neutral'}
            </Text>
          </View>
        </View>
      ))}
    </GlassCard>
  );
}

function TransitView() {
  const transits = [
    { planet: 'Jupiter', from: 'Taurus', to: 'Gemini', date: 'May 14, 2025', effect: 'Education & communication focus' },
    { planet: 'Saturn', from: 'Aquarius', to: 'Pisces', date: 'Mar 29, 2025', effect: 'Spiritual growth period' },
    { planet: 'Rahu', from: 'Pisces', to: 'Aquarius', date: 'Nov 18, 2025', effect: 'Technology & groups focus' },
  ];

  return (
    <GlassCard>
      <Text style={styles.cardTitle}>Major Planetary Transits</Text>
      {transits.map(t => (
        <View key={t.planet} style={styles.transitRow}>
          <Text style={styles.transitPlanet}>{t.planet}</Text>
          <View style={styles.transitArrow}>
            <Text style={styles.transitFrom}>{t.from}</Text>
            <Text style={styles.transitArrowText}>→</Text>
            <Text style={styles.transitTo}>{t.to}</Text>
          </View>
          <Text style={styles.transitDate}>{t.date}</Text>
          <Text style={styles.transitEffect}>{t.effect}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PanchangaLimb({ number, title, subtitle, icon, main, sub, color }:
  { number: string; title: string; subtitle: string; icon: string; main: string; sub: string; color: string }) {
  return (
    <View style={[subStyles.limb, { borderColor: color + '33' }]}>
      <View style={subStyles.limbNumber}>
        <Text style={[subStyles.limbNumText, { color }]}>{number}</Text>
      </View>
      <Text style={subStyles.limbIcon}>{icon}</Text>
      <Text style={[subStyles.limbTitle, { color }]}>{title}</Text>
      <Text style={subStyles.limbSubtitle}>{subtitle}</Text>
      <Text style={subStyles.limbMain}>{main}</Text>
      <Text style={subStyles.limbSub}>{sub}</Text>
    </View>
  );
}

function TimeItem({ icon, label, value, color }:
  { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={subStyles.timeItem}>
      <Text style={[subStyles.timeIcon, { color }]}>{icon}</Text>
      <Text style={subStyles.timeLabel}>{label}</Text>
      <Text style={subStyles.timeValue}>{value}</Text>
    </View>
  );
}

function InausCard({ label, time, severity }:
  { label: string; time: string; severity: 'high' | 'medium' | 'auspicious' }) {
  const color = severity === 'high' ? Colors.error
    : severity === 'medium' ? Colors.warning
    : Colors.success;
  return (
    <View style={[subStyles.inausRow, { borderLeftColor: color }]}>
      <Text style={[subStyles.inausLabel, { color }]}>{label}</Text>
      <Text style={subStyles.inausTime}>{time}</Text>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    marginBottom: Spacing[3],
  },
  scroll:       { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[4] },
  samvatCard:   { marginBottom: Spacing[4] },
  samvatText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  masaText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  timesCard:    { marginBottom: Spacing[3] },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  inauspCard:   { marginBottom: Spacing[3] },
  inausDivider: {},
  horaCard:     { marginBottom: Spacing[3] },
  horaRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    paddingVertical: Spacing[1],
  },
  horaItem: {
    alignItems: 'center',
    backgroundColor: Colors.glassSurface,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 72,
  },
  horaName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
  },
  horaTime: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
  comingSoon: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing[8],
  },
  muhurtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  muhurtaIcon: { fontSize: 20 },
  muhurtaInfo: { flex: 1 },
  muhurtaName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  muhurtaDays: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  muhurtaStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  muhurtaStatusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
  },
  transitRow: {
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 4,
  },
  transitPlanet: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  transitArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transitFrom: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  transitArrowText: { color: Colors.textMuted },
  transitTo: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  transitDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  transitEffect: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  bottomPadding: { height: 100 },
});

const subStyles = StyleSheet.create({
  limb: {
    width: '47%',
    backgroundColor: Colors.glassSurface,
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing[3],
    alignItems: 'center',
    gap: 3,
  },
  limbNumber: {
    position: 'absolute',
    top: 6, left: 8,
  },
  limbNumText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    opacity: 0.6,
  },
  limbIcon: { fontSize: 22 },
  limbTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
  limbSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  limbMain: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 2,
  },
  limbSub: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  timeItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: Colors.glassSurface,
    borderRadius: 8,
    padding: Spacing[2],
    gap: 2,
  },
  timeIcon: { fontSize: 18 },
  timeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  timeValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  inausRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingLeft: Spacing[2],
    borderLeftWidth: 3,
    marginBottom: Spacing[1],
  },
  inausLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
  inausTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
