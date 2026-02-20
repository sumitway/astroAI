import React from 'react';
import {
  Platform, StyleSheet, View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// ─── Tab definitions ────────────────────────────────────────────────────────
const TABS = [
  { name: 'index',    label: 'Home',     icon: '✦', desc: 'Dashboard' },
  { name: 'charts',  label: 'Charts',   icon: '◎', desc: 'Birth Chart' },
  { name: 'panchanga', label: 'Panchanga', icon: '☽', desc: 'Daily Almanac' },
  { name: 'chat',    label: 'AI Guide', icon: '◈', desc: 'Ask Jyotish AI' },
  { name: 'booking', label: 'Booking',  icon: '◉', desc: 'Consult Experts' },
  { name: 'profile', label: 'Profile',  icon: '⊕', desc: 'My Details' },
];

const SIDEBAR_WIDTH = 220;

export default function TabLayout() {
  const isWeb = Platform.OS === 'web';
  return (
    <Tabs
      sceneContainerStyle={isWeb ? styles.webSceneContainer : undefined}
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"     options={{ title: 'Home' }} />
      <Tabs.Screen name="charts"    options={{ title: 'Charts' }} />
      <Tabs.Screen name="panchanga" options={{ title: 'Panchanga' }} />
      <Tabs.Screen name="chat"      options={{ title: 'AI Guide' }} />
      <Tabs.Screen name="booking"   options={{ title: 'Booking' }} />
      <Tabs.Screen name="profile"   options={{ title: 'Profile' }} />
    </Tabs>
  );
}

// ─── Unified tab bar: sidebar on web, bottom bar on mobile ──────────────────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  if (Platform.OS === 'web') {
    return <WebSidebar state={state} navigation={navigation} />;
  }
  return <MobileTabBar state={state} navigation={navigation} />;
}

// ─── Web: Left Sidebar ───────────────────────────────────────────────────────
function WebSidebar({ state, navigation }: Pick<BottomTabBarProps, 'state' | 'navigation'>) {
  return (
    <View style={sideStyles.sidebar}>
      {/* Brand */}
      <View style={sideStyles.brand}>
        <Text style={sideStyles.brandIcon}>✦</Text>
        <View>
          <Text style={sideStyles.brandName}>Jyotish AI</Text>
          <Text style={sideStyles.brandSub}>Vedic Astrology</Text>
        </View>
      </View>

      <View style={sideStyles.divider} />

      {/* Nav Items */}
      <ScrollView style={sideStyles.navScroll} showsVerticalScrollIndicator={false}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[sideStyles.navItem, isFocused && sideStyles.navItemActive]}
              onPress={() => navigation.navigate(tab.name)}
              activeOpacity={0.7}
            >
              <Text style={[sideStyles.navIcon, { color: isFocused ? Colors.primary : Colors.inactiveTab }]}>
                {tab.icon}
              </Text>
              <View style={sideStyles.navText}>
                <Text style={[sideStyles.navLabel, { color: isFocused ? Colors.primary : Colors.textPrimary }]}>
                  {tab.label}
                </Text>
                <Text style={sideStyles.navDesc}>{tab.desc}</Text>
              </View>
              {isFocused && <View style={sideStyles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={sideStyles.sidebarFooter}>
        <View style={sideStyles.divider} />
        <Text style={sideStyles.footerText}>Powered by Claude AI</Text>
      </View>
    </View>
  );
}

// ─── Mobile: Bottom Tab Bar ──────────────────────────────────────────────────
function MobileTabBar({ state, navigation }: Pick<BottomTabBarProps, 'state' | 'navigation'>) {
  return (
    <View style={mobileStyles.tabBar}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, mobileStyles.androidBg]} />
      )}
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={mobileStyles.tabItem}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={[mobileStyles.tabIcon, { color: isFocused ? Colors.primary : Colors.inactiveTab }]}>
              {tab.icon}
            </Text>
            <Text style={[mobileStyles.tabLabel, { color: isFocused ? Colors.primary : Colors.inactiveTab }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  webSceneContainer: {
    marginLeft: SIDEBAR_WIDTH,
  },
});

const sideStyles = StyleSheet.create({
  sidebar: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.deepSpace,
    borderRightWidth: 1,
    borderRightColor: Colors.glassBorder,
    zIndex: 100,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
  },
  brandIcon: {
    fontSize: 28,
    color: Colors.primary,
  },
  brandName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  navScroll: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    marginHorizontal: Spacing[2],
    marginBottom: Spacing[1],
    borderRadius: 10,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: Colors.primaryDim,
  },
  navIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  navText: {
    flex: 1,
    gap: 1,
  },
  navLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },
  navDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
  },
  activeIndicator: {
    width: 3,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sidebarFooter: {
    paddingTop: Spacing[2],
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    letterSpacing: 0.5,
  },
});

const mobileStyles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.glassOverlay,
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    flexDirection: 'row',
  },
  androidBg: {
    backgroundColor: Colors.glassOverlay,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
  },
});
