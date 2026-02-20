/**
 * Panchanga Screen
 * Daily astrological almanac: Tithi, Vara, Nakshatra, Yoga, Karana,
 * planetary hora, auspicious/inauspicious times, moon phase.
 *
 * Includes a birth details form so users can get personalized Panchanga
 * for their city and date from the Jyotish AI backend.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';
import { TabSelector } from '@components/ui/TabSelector';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl
  ?? process.env.EXPO_PUBLIC_API_URL
  ?? '';

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

// ─── Birth Details Form ──────────────────────────────────────────────────────

interface BirthDetails {
  city: string;
  date: string;    // YYYY-MM-DD
  dob: string;     // date of birth YYYY-MM-DD (optional, for personalized transits)
  tob: string;     // time of birth HH:MM (optional)
}

interface PersonalizedPanchanga {
  tithi?: string;
  nakshatra?: string;
  yoga?: string;
  vara?: string;
  karana?: string;
  sunrise?: string;
  sunset?: string;
  message?: string;
}

function BirthDetailsForm({ onResult }: { onResult: (data: PersonalizedPanchanga) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<BirthDetails>({
    city: '',
    date: new Date().toISOString().split('T')[0],
    dob: '',
    tob: '',
  });

  async function handleFetch() {
    if (!form.city.trim()) { setError('Please enter your city'); return; }
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams({
        city: form.city.trim(),
        date: form.date,
        ...(form.dob ? { dob: form.dob } : {}),
        ...(form.tob ? { tob: form.tob } : {}),
      });
      const res = await fetch(`${API_URL}/panchanga?${params.toString()}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      onResult(data);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message ?? 'Could not fetch. Check API URL.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <TouchableOpacity style={formStyles.banner} onPress={() => setOpen(true)} activeOpacity={0.85}>
        <LinearGradient
          colors={Colors.gradients.cosmic}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={formStyles.bannerGradient}
        >
          <Text style={formStyles.bannerIcon}>✦</Text>
          <View style={{ flex: 1 }}>
            <Text style={formStyles.bannerTitle}>Get Personalized Panchanga</Text>
            <Text style={formStyles.bannerSub}>Enter your city & date of birth for live results</Text>
          </View>
          <Text style={formStyles.bannerArrow}>›</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <GlassCard style={formStyles.card}>
      <View style={formStyles.cardHeader}>
        <Text style={formStyles.cardTitle}>Your Birth Details</Text>
        <TouchableOpacity onPress={() => setOpen(false)}>
          <Text style={formStyles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={formStyles.row}>
        <View style={formStyles.fieldFull}>
          <Text style={formStyles.label}>City / Location *</Text>
          <TextInput
            style={formStyles.input}
            placeholder="e.g. Mumbai, New Delhi, London"
            placeholderTextColor={Colors.textMuted}
            value={form.city}
            onChangeText={v => setForm(f => ({ ...f, city: v }))}
          />
        </View>
      </View>

      <View style={formStyles.row}>
        <View style={formStyles.fieldHalf}>
          <Text style={formStyles.label}>Date (for Panchanga)</Text>
          <TextInput
            style={formStyles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textMuted}
            value={form.date}
            onChangeText={v => setForm(f => ({ ...f, date: v }))}
          />
        </View>
        <View style={formStyles.fieldHalf}>
          <Text style={formStyles.label}>Date of Birth (optional)</Text>
          <TextInput
            style={formStyles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textMuted}
            value={form.dob}
            onChangeText={v => setForm(f => ({ ...f, dob: v }))}
          />
        </View>
      </View>

      <View style={formStyles.row}>
        <View style={formStyles.fieldHalf}>
          <Text style={formStyles.label}>Time of Birth (optional)</Text>
          <TextInput
            style={formStyles.input}
            placeholder="HH:MM  e.g. 14:30"
            placeholderTextColor={Colors.textMuted}
            value={form.tob}
            onChangeText={v => setForm(f => ({ ...f, tob: v }))}
          />
        </View>
      </View>

      {!!error && <Text style={formStyles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[formStyles.fetchBtn, loading && { opacity: 0.6 }]}
        onPress={handleFetch}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Colors.gradients.cosmic}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={formStyles.fetchBtnGradient}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={formStyles.fetchBtnText}>Get My Panchanga  ✦</Text>
          }
        </LinearGradient>
      </TouchableOpacity>

      <Text style={formStyles.privacyNote}>
        Birth details are only used to calculate your Panchanga and are not stored.
      </Text>
    </GlassCard>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function PanchangaScreen() {
  const [activeTab, setActiveTab] = useState('today');
  const [personalizedData, setPersonalizedData] = useState<PersonalizedPanchanga | null>(null);

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
          {/* Birth Details Form — always visible at top */}
          <BirthDetailsForm onResult={setPersonalizedData} />

          {/* Show personalized API result if available */}
          {personalizedData && (
            <GlassCard style={{ marginBottom: Spacing[3] }}>
              <Text style={styles.cardTitle}>✦ Your Personalized Panchanga</Text>
              {personalizedData.message && (
                <Text style={{ color: Colors.textSecondary, fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing[2] }}>
                  {personalizedData.message}
                </Text>
              )}
              {[
                { label: 'Tithi', value: personalizedData.tithi },
                { label: 'Nakshatra', value: personalizedData.nakshatra },
                { label: 'Yoga', value: personalizedData.yoga },
                { label: 'Vara', value: personalizedData.vara },
                { label: 'Karana', value: personalizedData.karana },
                { label: 'Sunrise', value: personalizedData.sunrise },
                { label: 'Sunset', value: personalizedData.sunset },
              ].filter(r => r.value).map(r => (
                <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.divider }}>
                  <Text style={{ fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textMuted }}>{r.label}</Text>
                  <Text style={{ fontFamily: FontFamily.bold, fontSize: FontSize.sm, color: Colors.textPrimary }}>{r.value}</Text>
                </View>
              ))}
            </GlassCard>
          )}

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

const formStyles = StyleSheet.create({
  banner: {
    marginBottom: Spacing[3],
    borderRadius: 14,
    overflow: 'hidden',
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: 14,
  },
  bannerIcon: {
    fontSize: 22,
    color: '#fff',
  },
  bannerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: '#fff',
  },
  bannerSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 2,
  },
  bannerArrow: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.6)',
  },
  card: {
    marginBottom: Spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  closeBtn: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    padding: Spacing[1],
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  fieldFull: {
    flex: 1,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.glassSurface,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    paddingHorizontal: Spacing[3],
    paddingVertical: Platform.OS === 'ios' ? Spacing[3] : Spacing[2],
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginBottom: Spacing[2],
  },
  fetchBtn: {
    marginTop: Spacing[1],
    borderRadius: 10,
    overflow: 'hidden',
  },
  fetchBtnGradient: {
    paddingVertical: Spacing[3],
    alignItems: 'center',
    borderRadius: 10,
  },
  fetchBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: '#fff',
    letterSpacing: 0.5,
  },
  privacyNote: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing[2],
  },
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
