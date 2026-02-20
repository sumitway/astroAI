/**
 * DivisionalChartGrid.tsx
 * Renders a scrollable grid of divisional charts (D1–D60).
 * Each chart is a mini SouthIndianChart.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { SouthIndianChart } from './SouthIndianChart';
import type { ChartData } from './SouthIndianChart';

export interface DivisionalChartInfo {
  division: string;         // 'D1', 'D2', ..., 'D60'
  title: string;            // 'Rasi', 'Hora', etc.
  description: string;      // Short description
  data?: ChartData;         // null if not yet calculated
  isLoading?: boolean;
}

export const DIVISIONAL_CHART_LIST: Omit<DivisionalChartInfo, 'data'>[] = [
  { division: 'D1',  title: 'Rasi',        description: 'Main birth chart' },
  { division: 'D2',  title: 'Hora',        description: 'Wealth & finances' },
  { division: 'D3',  title: 'Drekkana',    description: 'Siblings & courage' },
  { division: 'D4',  title: 'Chaturthamsa',description: 'Fortune & property' },
  { division: 'D5',  title: 'Panchamsa',   description: 'Fame & authority' },
  { division: 'D6',  title: 'Shashthamsa', description: 'Health & disease' },
  { division: 'D7',  title: 'Saptamsa',    description: 'Children & progeny' },
  { division: 'D8',  title: 'Ashtamsa',    description: 'Longevity & mishaps' },
  { division: 'D9',  title: 'Navamsa',     description: 'Spouse & dharma' },
  { division: 'D10', title: 'Dasamsa',     description: 'Career & profession' },
  { division: 'D11', title: 'Ekadamsa',    description: 'Luck & fortune' },
  { division: 'D12', title: 'Dwadasamsa',  description: 'Parents & ancestry' },
  { division: 'D16', title: 'Shodasamsa',  description: 'Vehicles & travel' },
  { division: 'D20', title: 'Vimshamsa',   description: 'Spiritual matters' },
  { division: 'D24', title: 'Chaturvimshamsa', description: 'Education & knowledge' },
  { division: 'D27', title: 'Saptavimshamsa',  description: 'Strength & weakness' },
  { division: 'D30', title: 'Trimshamsa',  description: 'Evils & misfortunes' },
  { division: 'D40', title: 'Khavedamsa',  description: 'Auspicious effects' },
  { division: 'D45', title: 'Akshavedamsa',description: 'All matters general' },
  { division: 'D60', title: 'Shashtiamsa', description: 'Past life karma' },
];

interface DivisionalChartGridProps {
  charts: DivisionalChartInfo[];
  columnsPerRow?: 2 | 3;
  onChartPress?: (chart: DivisionalChartInfo) => void;
  onPlanetPress?: (planet: any, division: string) => void;
  selectedDivision?: string;
}

export const DivisionalChartGrid: React.FC<DivisionalChartGridProps> = ({
  charts,
  columnsPerRow = 2,
  onChartPress,
  onPlanetPress,
  selectedDivision,
}) => {
  const { width } = useWindowDimensions();
  const padding = Spacing[4];
  const gap = Spacing[3];
  const cellWidth = (width - padding * 2 - gap * (columnsPerRow - 1)) / columnsPerRow;
  const chartSize = cellWidth - Spacing[4]; // inner padding

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Charts in rows */}
      {Array.from({ length: Math.ceil(charts.length / columnsPerRow) }, (_, rowIdx) => (
        <View key={`row-${rowIdx}`} style={[styles.row, { gap }]}>
          {charts.slice(rowIdx * columnsPerRow, (rowIdx + 1) * columnsPerRow).map(chart => (
            <DivisionalChartCard
              key={chart.division}
              chart={chart}
              cellWidth={cellWidth}
              chartSize={chartSize}
              isSelected={selectedDivision === chart.division}
              onChartPress={onChartPress}
              onPlanetPress={onPlanetPress}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

interface DivisionalChartCardProps {
  chart: DivisionalChartInfo;
  cellWidth: number;
  chartSize: number;
  isSelected: boolean;
  onChartPress?: (chart: DivisionalChartInfo) => void;
  onPlanetPress?: (planet: any, division: string) => void;
}

const DivisionalChartCard: React.FC<DivisionalChartCardProps> = ({
  chart, cellWidth, chartSize, isSelected, onChartPress, onPlanetPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, { width: cellWidth }, isSelected && styles.cardSelected]}
      onPress={() => onChartPress?.(chart)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.divisionLabel}>{chart.division}</Text>
        <Text style={styles.titleLabel}>{chart.title}</Text>
      </View>
      <Text style={styles.descLabel} numberOfLines={1}>{chart.description}</Text>

      <View style={styles.chartWrapper}>
        {chart.isLoading ? (
          <View style={[styles.placeholder, { width: chartSize, height: chartSize }]}>
            <Text style={styles.loadingText}>Calculating...</Text>
          </View>
        ) : chart.data ? (
          <SouthIndianChart
            data={{ ...chart.data, chartType: chart.division }}
            size={chartSize}
            showDegrees={false}
            showHouseNumbers={false}
            highlightAscendant={true}
            onPlanetPress={pp => onPlanetPress?.(pp, chart.division)}
          />
        ) : (
          <View style={[styles.placeholder, { width: chartSize, height: chartSize }]}>
            <Text style={styles.placeholderText}>{chart.division}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: Colors.glassSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing[2],
    gap: Spacing[1],
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  divisionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  titleLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  descLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: Spacing[1],
  },
  placeholder: {
    backgroundColor: Colors.glassSurface,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  placeholderText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.glassBorderBright,
    letterSpacing: 2,
  },
  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
