/**
 * Profile Screen
 * User birth data management, saved charts, settings, and account.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';
import { SIGNS } from '@constants/signs';
import { NAKSHATRAS } from '@constants/nakshatras';

const USER_PROFILE = {
  name: 'Arjun Sharma',
  email: 'arjun@example.com',
  birthDate: 'June 15, 1990',
  birthTime: '08:45 AM',
  birthPlace: 'Mumbai, Maharashtra, India',
  ascendant: 4,       // Cancer
  moonSign: 10,       // Capricorn
  sunSign: 3,         // Gemini
  nakshatra: 8,       // Pushya
  gotra: 'Kashyap',
  plan: 'Premium',
};

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyHoroscope, setDailyHoroscope] = useState(true);
  const [transitAlerts, setTransitAlerts] = useState(false);

  const ascSign = SIGNS[USER_PROFILE.ascendant - 1];
  const moonSign = SIGNS[USER_PROFILE.moonSign - 1];
  const nakshatra = NAKSHATRAS[USER_PROFILE.nakshatra - 1];

  return (
    <View style={styles.container}>
      <CosmicBackground starCount={40} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <LinearGradient
            colors={Colors.gradients.cosmic}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileBanner}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {USER_PROFILE.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={styles.profileName}>{USER_PROFILE.name}</Text>
            <Text style={styles.profileEmail}>{USER_PROFILE.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>✦ {USER_PROFILE.plan} Member</Text>
            </View>
          </LinearGradient>

          {/* Birth Details */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Birth Information</Text>
              <TouchableOpacity>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            <BirthDetailRow icon="📅" label="Date" value={USER_PROFILE.birthDate} />
            <BirthDetailRow icon="🕐" label="Time" value={USER_PROFILE.birthTime} />
            <BirthDetailRow icon="📍" label="Place" value={USER_PROFILE.birthPlace} />
            {USER_PROFILE.gotra && (
              <BirthDetailRow icon="✦" label="Gotra" value={USER_PROFILE.gotra} />
            )}
          </GlassCard>

          {/* Astrological Profile */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Astrological Profile</Text>
            <View style={styles.astroGrid}>
              <AstroProfileCard
                label="Lagna (Ascendant)"
                value={ascSign.name}
                symbol={ascSign.symbol}
                color={ascSign.color}
              />
              <AstroProfileCard
                label="Moon Sign (Rashi)"
                value={moonSign.name}
                symbol={moonSign.symbol}
                color={moonSign.color}
              />
              <AstroProfileCard
                label="Birth Nakshatra"
                value={nakshatra.name}
                symbol="✦"
                color={Colors.textGold}
                sub={`Lord: ${nakshatra.lord}`}
              />
              <AstroProfileCard
                label="Dasha Lord"
                value="Jupiter"
                symbol="♃"
                color={Colors.planets.jupiter}
                sub="Until 2034"
              />
            </View>
          </GlassCard>

          {/* Saved Charts */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Charts</Text>
              <TouchableOpacity>
                <Text style={styles.editLink}>Add New +</Text>
              </TouchableOpacity>
            </View>
            <SavedChartRow
              name="My Birth Chart"
              date="Jun 15, 1990 · 08:45 AM"
              place="Mumbai, India"
              isPrimary
            />
            <SavedChartRow
              name="Spouse Chart"
              date="Aug 22, 1992 · 11:20 AM"
              place="Delhi, India"
            />
            <SavedChartRow
              name="Son's Chart"
              date="Mar 10, 2018 · 2:15 PM"
              place="Bangalore, India"
            />
          </GlassCard>

          {/* Notifications */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <SettingToggle
              label="Enable Notifications"
              value={notificationsEnabled}
              onToggle={setNotificationsEnabled}
            />
            <SettingToggle
              label="Daily Horoscope"
              sub="Receive your personalized daily reading"
              value={dailyHoroscope}
              onToggle={setDailyHoroscope}
            />
            <SettingToggle
              label="Transit Alerts"
              sub="Get notified of major planetary transits"
              value={transitAlerts}
              onToggle={setTransitAlerts}
            />
          </GlassCard>

          {/* Account */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <MenuRow icon="💳" label="Subscription & Billing" />
            <MenuRow icon="🔒" label="Privacy & Security" />
            <MenuRow icon="❓" label="Help & Support" />
            <MenuRow icon="⭐" label="Rate the App" />
            <MenuRow icon="📤" label="Share with Friends" />
            <MenuRow icon="🚪" label="Sign Out" destructive />
          </GlassCard>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function BirthDetailRow({ icon, label, value }:
  { icon: string; label: string; value: string }) {
  return (
    <View style={subStyles.birthRow}>
      <Text style={subStyles.birthIcon}>{icon}</Text>
      <Text style={subStyles.birthLabel}>{label}</Text>
      <Text style={subStyles.birthValue}>{value}</Text>
    </View>
  );
}

function AstroProfileCard({ label, value, symbol, color, sub }:
  { label: string; value: string; symbol: string; color: string; sub?: string }) {
  return (
    <View style={[subStyles.astroCard, { borderColor: color + '33' }]}>
      <Text style={[subStyles.astroSymbol, { color }]}>{symbol}</Text>
      <Text style={subStyles.astroLabel}>{label}</Text>
      <Text style={[subStyles.astroValue, { color }]}>{value}</Text>
      {sub && <Text style={subStyles.astroSub}>{sub}</Text>}
    </View>
  );
}

function SavedChartRow({ name, date, place, isPrimary }:
  { name: string; date: string; place: string; isPrimary?: boolean }) {
  return (
    <TouchableOpacity style={subStyles.savedChartRow}>
      <View style={subStyles.savedChartIcon}>
        <Text style={subStyles.savedChartIconText}>◎</Text>
      </View>
      <View style={subStyles.savedChartInfo}>
        <View style={subStyles.savedChartNameRow}>
          <Text style={subStyles.savedChartName}>{name}</Text>
          {isPrimary && (
            <View style={subStyles.primaryBadge}>
              <Text style={subStyles.primaryBadgeText}>Primary</Text>
            </View>
          )}
        </View>
        <Text style={subStyles.savedChartDate}>{date}</Text>
        <Text style={subStyles.savedChartPlace}>{place}</Text>
      </View>
      <Text style={subStyles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function SettingToggle({ label, sub, value, onToggle }:
  { label: string; sub?: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={subStyles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={subStyles.settingLabel}>{label}</Text>
        {sub && <Text style={subStyles.settingSub}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.glassBorder, true: Colors.primary + '88' }}
        thumbColor={value ? Colors.primary : Colors.textMuted}
      />
    </View>
  );
}

function MenuRow({ icon, label, destructive }:
  { icon: string; label: string; destructive?: boolean }) {
  return (
    <TouchableOpacity style={subStyles.menuRow} activeOpacity={0.7}>
      <Text style={subStyles.menuIcon}>{icon}</Text>
      <Text style={[subStyles.menuLabel, destructive && { color: Colors.error }]}>
        {label}
      </Text>
      <Text style={subStyles.menuChevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.cosmicVoid },
  safeArea:     { flex: 1 },
  scroll:       { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[4] },
  profileBanner: {
    borderRadius: 16,
    padding: Spacing[6],
    alignItems: 'center',
    marginBottom: Spacing[4],
    marginTop: Spacing[2],
    gap: Spacing[2],
  },
  avatarCircle: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  avatarInitials: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  profileName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: Spacing[1],
  },
  planText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textGold,
  },
  section:      { marginBottom: Spacing[4] },
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
  editLink: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  astroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  bottomPadding: { height: 100 },
});

const subStyles = StyleSheet.create({
  birthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing[3],
  },
  birthIcon: { fontSize: 16, width: 22, textAlign: 'center' },
  birthLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    width: 60,
  },
  birthValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  astroCard: {
    width: '47%',
    backgroundColor: Colors.glassSurface,
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing[3],
    alignItems: 'center',
    gap: 3,
  },
  astroSymbol: { fontSize: 24, marginBottom: 2 },
  astroLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  astroValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  astroSub: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
  },
  savedChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  savedChartIcon: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedChartIconText: { fontSize: 16, color: Colors.primary },
  savedChartInfo: { flex: 1 },
  savedChartNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  savedChartName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  primaryBadge: {
    backgroundColor: Colors.primaryDim,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  primaryBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.primary,
  },
  savedChartDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  savedChartPlace: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  chevron: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.textMuted,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  settingSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing[3],
  },
  menuIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  menuChevron: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.textMuted,
  },
});
