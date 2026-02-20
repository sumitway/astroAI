/**
 * Charts Screen
 * Full-featured chart viewer with South/North Indian toggle,
 * divisional chart grid, and detailed planet positions table.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';
import { TabSelector } from '@components/ui/TabSelector';
import { SouthIndianChart } from '@components/charts/SouthIndianChart';
import { NorthIndianChart } from '@components/charts/NorthIndianChart';
import { DivisionalChartGrid, DIVISIONAL_CHART_LIST } from '@components/charts/DivisionalChartGrid';
import { PLANETS, PLANET_ABBREVIATIONS } from '@constants/planets';
import { SIGNS } from '@constants/signs';
import { NAKSHATRAS } from '@constants/nakshatras';
import type { ChartData, PlanetPosition } from '@components/charts/SouthIndianChart';
import type { DivisionalChartInfo } from '@components/charts/DivisionalChartGrid';

const SAMPLE_CHART: ChartData = {
  ascendant: 4,
  chartType: 'D1',
  label: 'Birth Chart',
  planets: [
    { planet: 'sun',     sign: 4,  degree: 12.3, isRetrograde: false },
    { planet: 'moon',    sign: 10, degree: 22.8, isRetrograde: false },
    { planet: 'mars',    sign: 6,  degree: 8.1,  isRetrograde: false },
    { planet: 'mercury', sign: 5,  degree: 28.5, isRetrograde: true  },
    { planet: 'jupiter', sign: 1,  degree: 15.2, isRetrograde: false },
    { planet: 'venus',   sign: 3,  degree: 5.7,  isRetrograde: false },
    { planet: 'saturn',  sign: 11, degree: 19.4, isRetrograde: true  },
    { planet: 'rahu',    sign: 2,  degree: 11.9, isRetrograde: true  },
    { planet: 'ketu',    sign: 8,  degree: 11.9, isRetrograde: true  },
  ],
};

const MAIN_TABS = [
  { key: 'south', label: 'South Indian', icon: '▦' },
  { key: 'north', label: 'North Indian', icon: '◈' },
  { key: 'divisional', label: 'Divisional', icon: '⊞' },
  { key: 'planets', label: 'Planets', icon: '✦' },
];

const DIVISIONAL_CHARTS: DivisionalChartInfo[] = DIVISIONAL_CHART_LIST.map(c => ({
  ...c,
  data: c.division === 'D1' ? SAMPLE_CHART : undefined,
}));

export default function ChartsScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('south');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const chartSize = Math.min(width - 48, 360);

  return (
    <View style={styles.container}>
      <CosmicBackground starCount={60} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kundali Charts</Text>
          <Text style={styles.headerSub}>Ascendant: Cancer (4) · D1 Rasi</Text>
        </View>

        <View style={styles.tabContainer}>
          <TabSelector
            tabs={MAIN_TABS}
            activeKey={activeTab}
            onSelect={setActiveTab}
            scrollable
            variant="capsule"
          />
        </View>

        {activeTab === 'south' && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chartArea}>
              <SouthIndianChart
                data={SAMPLE_CHART}
                size={chartSize}
                showDegrees={true}
                showHouseNumbers={true}
                highlightAscendant={true}
                onPlanetPress={setSelectedPlanet}
              />
            </View>

            {selectedPlanet && <PlanetDetail planet={selectedPlanet} />}

            <AscendantInfo ascendant={SAMPLE_CHART.ascendant} />
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}

        {activeTab === 'north' && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chartArea}>
              <NorthIndianChart
                data={SAMPLE_CHART}
                size={chartSize}
                showSignNames={true}
                highlightAscendant={true}
                onPlanetPress={setSelectedPlanet}
              />
            </View>
            {selectedPlanet && <PlanetDetail planet={selectedPlanet} />}
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}

        {activeTab === 'divisional' && (
          <DivisionalChartGrid
            charts={DIVISIONAL_CHARTS}
            columnsPerRow={2}
            selectedDivision="D1"
            onChartPress={chart => {}}
          />
        )}

        {activeTab === 'planets' && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <PlanetPositionsTable planets={SAMPLE_CHART.planets} ascendant={SAMPLE_CHART.ascendant} />
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PlanetDetail({ planet }: { planet: PlanetPosition }) {
  const pInfo = PLANETS.find(p => p.id === planet.planet);
  const sign = SIGNS[planet.sign - 1];
  const nakshatraIdx = Math.floor((((planet.sign - 1) * 30 + planet.degree) / (360 / 27)));
  const nakshatra = NAKSHATRAS[Math.min(nakshatraIdx, 26)];
  const house = 1; // simplified

  return (
    <GlassCard style={styles.planetDetail}>
      <View style={styles.planetDetailHeader}>
        <Text style={[styles.planetDetailSymbol, { color: pInfo?.color ?? Colors.textPrimary }]}>
          {pInfo?.symbol}
        </Text>
        <View>
          <Text style={[styles.planetDetailName, { color: pInfo?.color }]}>
            {pInfo?.name} {planet.isRetrograde ? '℞' : ''}
          </Text>
          <Text style={styles.planetDetailSanskrit}>{pInfo?.sanskritName}</Text>
        </View>
      </View>
      <View style={styles.planetDetailGrid}>
        <DetailItem label="Sign" value={`${sign.name} (${planet.sign})`} />
        <DetailItem label="Degree" value={`${planet.degree.toFixed(2)}°`} />
        <DetailItem label="Nakshatra" value={nakshatra?.name ?? '—'} />
        <DetailItem label="Lord" value={nakshatra?.lord ?? '—'} />
        <DetailItem label="Status" value={planet.isRetrograde ? 'Retrograde' : planet.isCombust ? 'Combust' : 'Direct'} />
        <DetailItem label="Nature" value={pInfo?.nature ?? '—'} />
      </View>
    </GlassCard>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={subStyles.detailItem}>
      <Text style={subStyles.detailLabel}>{label}</Text>
      <Text style={subStyles.detailValue}>{value}</Text>
    </View>
  );
}

function AscendantInfo({ ascendant }: { ascendant: number }) {
  const sign = SIGNS[ascendant - 1];
  return (
    <GlassCard style={styles.ascCard}>
      <Text style={styles.ascTitle}>Ascendant (Lagna)</Text>
      <View style={styles.ascRow}>
        <Text style={[styles.ascSign, { color: sign.color }]}>{sign.symbol} {sign.name}</Text>
        <View style={styles.ascDetails}>
          <Text style={styles.ascDetail}>Element: {sign.element}</Text>
          <Text style={styles.ascDetail}>Ruler: {sign.ruler}</Text>
          <Text style={styles.ascDetail}>Quality: {sign.quality}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

function PlanetPositionsTable({ planets, ascendant }: { planets: PlanetPosition[]; ascendant: number }) {
  return (
    <GlassCard style={styles.tableCard}>
      <Text style={styles.tableTitle}>Planetary Positions</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Planet</Text>
        <Text style={[styles.tableCell, styles.tableHeaderText]}>Sign</Text>
        <Text style={[styles.tableCell, styles.tableHeaderText]}>House</Text>
        <Text style={[styles.tableCell, styles.tableHeaderText]}>Degree</Text>
        <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
      </View>
      {planets.map(pp => {
        const pInfo = PLANETS.find(p => p.id === pp.planet);
        const sign = SIGNS[pp.sign - 1];
        const house = ((pp.sign - ascendant + 12) % 12) + 1;
        return (
          <View key={pp.planet} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
              <Text style={{ color: pInfo?.color ?? Colors.textPrimary, fontSize: 14 }}>{pInfo?.symbol}</Text>
              <Text style={[styles.tablePlanetName, { color: pInfo?.color ?? Colors.textPrimary }]}>
                {PLANET_ABBREVIATIONS[pp.planet]}
              </Text>
            </View>
            <Text style={[styles.tableCell, styles.tableCellText, { color: sign.color + 'DD' }]}>
              {sign.name.slice(0, 3)}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellText]}>{house}</Text>
            <Text style={[styles.tableCell, styles.tableCellText]}>{pp.degree.toFixed(1)}°</Text>
            <Text style={[styles.tableCell, styles.tableCellText, { color: pp.isRetrograde ? Colors.warning : pp.isCombust ? Colors.error : Colors.success }]}>
              {pp.isRetrograde ? '℞ R' : pp.isCombust ? 'Cbt' : 'D'}
            </Text>
          </View>
        );
      })}
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
  chartArea: {
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  planetDetail: { marginBottom: Spacing[3] },
  planetDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  planetDetailSymbol: { fontSize: 36 },
  planetDetailName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  planetDetailSanskrit: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  planetDetailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  ascCard: { marginBottom: Spacing[3] },
  ascTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  ascRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ascSign: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  ascDetails: { gap: 3 },
  ascDetail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  tableCard: { marginBottom: Spacing[3] },
  tableTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    paddingBottom: Spacing[2],
    marginBottom: Spacing[1],
  },
  tableHeaderText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tableCell: { flex: 1, paddingHorizontal: 2 },
  tableCellText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  tablePlanetName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
  },
  bottomPadding: { height: 100 },
});

const subStyles = StyleSheet.create({
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.glassSurface,
    borderRadius: 8,
    padding: Spacing[2],
  },
  detailLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
});
