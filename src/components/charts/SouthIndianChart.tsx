/**
 * SouthIndianChart.tsx
 * Renders the classic South Indian fixed-sign grid (4×4 = 16 cells, 12 used).
 * Layout (sign positions):
 *
 *  [12-Pi][01-Ar][02-Ta][03-Ge]
 *  [11-Aq][  LABEL  ][04-Ca]
 *  [10-Cp][  LABEL  ][05-Le]
 *  [09-Sg][08-Sc][07-Li][06-Vi]
 *
 * Planets are placed into the house that corresponds to
 * (signNumber - ascendantSign + 12) % 12 + 1
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Svg, {
  Rect, Line, Text as SvgText, Circle, G,
} from 'react-native-svg';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { PLANETS, PLANET_ABBREVIATIONS } from '@constants/planets';
import { SIGNS } from '@constants/signs';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanetPosition {
  planet: string;       // planet id: 'sun', 'moon', ...
  sign: number;         // 1–12
  degree: number;       // 0–30
  isRetrograde?: boolean;
  isCombust?: boolean;
}

export interface ChartData {
  ascendant: number;    // 1–12 sign number
  planets: PlanetPosition[];
  chartType?: string;   // 'D1', 'D9', etc.
  label?: string;
}

interface SouthIndianChartProps {
  data: ChartData;
  size?: number;
  showDegrees?: boolean;
  showHouseNumbers?: boolean;
  highlightAscendant?: boolean;
  onPlanetPress?: (planet: PlanetPosition) => void;
  onCellPress?: (houseNumber: number, sign: number) => void;
}

// ─── Grid Layout ──────────────────────────────────────────────────────────────
// Fixed sign layout for South Indian chart
// Row 0: signs 12, 1, 2, 3
// Row 1: sign 11, [center-top], 4
// Row 2: sign 10, [center-bottom], 5
// Row 3: signs 9, 8, 7, 6

const SIGN_GRID: (number | null)[][] = [
  [12, 1,  2,  3],
  [11, null, null, 4],
  [10, null, null, 5],
  [9,  8,  7,  6],
];

const CENTER_CELLS = [
  { row: 1, col: 1 }, { row: 1, col: 2 },
  { row: 2, col: 1 }, { row: 2, col: 2 },
];

function isCenterCell(row: number, col: number) {
  return CENTER_CELLS.some(c => c.row === row && c.col === col);
}

function getSignAtCell(row: number, col: number): number | null {
  return SIGN_GRID[row][col];
}

function getHouseNumber(sign: number, ascendant: number): number {
  return ((sign - ascendant + 12) % 12) + 1;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  data,
  size,
  showDegrees = false,
  showHouseNumbers = true,
  highlightAscendant = true,
  onPlanetPress,
  onCellPress,
}) => {
  const { width } = useWindowDimensions();
  const chartSize = size ?? Math.min(width - 32, 380);
  const cellSize = chartSize / 4;

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Group planets by sign
  const planetsBySign = useMemo(() => {
    const map: Record<number, PlanetPosition[]> = {};
    for (const planet of data.planets) {
      if (!map[planet.sign]) map[planet.sign] = [];
      map[planet.sign].push(planet);
    }
    return map;
  }, [data.planets]);

  const handlePlanetPress = (planet: PlanetPosition) => {
    setSelectedPlanet(prev => prev === planet.planet ? null : planet.planet);
    onPlanetPress?.(planet);
  };

  return (
    <View style={[styles.wrapper, { width: chartSize, height: chartSize }]}>
      {/* SVG Grid Lines */}
      <Svg
        width={chartSize}
        height={chartSize}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Outer border */}
        <Rect
          x={1} y={1}
          width={chartSize - 2} height={chartSize - 2}
          fill="none"
          stroke={Colors.glassBorderBright}
          strokeWidth={1.5}
          rx={4}
        />
        {/* Grid lines - horizontal */}
        {[1, 2, 3].map(r => (
          <Line
            key={`h${r}`}
            x1={0} y1={r * cellSize}
            x2={chartSize} y2={r * cellSize}
            stroke={Colors.glassBorder}
            strokeWidth={1}
          />
        ))}
        {/* Grid lines - vertical */}
        {[1, 2, 3].map(c => (
          <Line
            key={`v${c}`}
            x1={c * cellSize} y1={0}
            x2={c * cellSize} y2={chartSize}
            stroke={Colors.glassBorder}
            strokeWidth={1}
          />
        ))}
        {/* Center diagonal lines (decorative) */}
        <Line
          x1={cellSize} y1={cellSize}
          x2={3 * cellSize} y2={cellSize}
          stroke={Colors.glassBorder} strokeWidth={0.5} strokeDasharray="4,4"
        />
        <Line
          x1={cellSize} y1={3 * cellSize}
          x2={3 * cellSize} y2={3 * cellSize}
          stroke={Colors.glassBorder} strokeWidth={0.5} strokeDasharray="4,4"
        />
        <Line
          x1={cellSize} y1={cellSize}
          x2={cellSize} y2={3 * cellSize}
          stroke={Colors.glassBorder} strokeWidth={0.5} strokeDasharray="4,4"
        />
        <Line
          x1={3 * cellSize} y1={cellSize}
          x2={3 * cellSize} y2={3 * cellSize}
          stroke={Colors.glassBorder} strokeWidth={0.5} strokeDasharray="4,4"
        />
      </Svg>

      {/* Cells */}
      {SIGN_GRID.map((row, rowIdx) =>
        row.map((signNum, colIdx) => {
          const isCenter = isCenterCell(rowIdx, colIdx);
          if (isCenter && signNum === null) return null;
          if (signNum === null) return null;

          const sign = SIGNS[signNum - 1];
          const houseNum = getHouseNumber(signNum, data.ascendant);
          const isAscendant = signNum === data.ascendant;
          const planetsInCell = planetsBySign[signNum] || [];

          return (
            <TouchableOpacity
              key={`cell-${rowIdx}-${colIdx}`}
              style={[
                styles.cell,
                {
                  left: colIdx * cellSize,
                  top: rowIdx * cellSize,
                  width: cellSize,
                  height: cellSize,
                },
                isAscendant && highlightAscendant && styles.ascendantCell,
              ]}
              onPress={() => onCellPress?.(houseNum, signNum)}
              activeOpacity={0.7}
            >
              {/* Sign number & abbreviation */}
              <View style={styles.cellHeader}>
                {showHouseNumbers && (
                  <Text style={styles.houseNum}>{houseNum}</Text>
                )}
                <Text style={[styles.signLabel, { color: sign.color + 'CC' }]}>
                  {sign.id.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              {/* Ascendant marker */}
              {isAscendant && (
                <View style={styles.lagnaMarker}>
                  <Text style={styles.lagnaText}>Asc</Text>
                </View>
              )}

              {/* Planets */}
              <View style={styles.planetsContainer}>
                {planetsInCell.map(pp => {
                  const pInfo = PLANETS.find(p => p.id === pp.planet);
                  const abbr = PLANET_ABBREVIATIONS[pp.planet] || pp.planet.slice(0, 2);
                  const isSelected = selectedPlanet === pp.planet;
                  return (
                    <TouchableOpacity
                      key={pp.planet}
                      onPress={() => handlePlanetPress(pp)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.planetChip, isSelected && styles.planetSelected]}>
                        <Text
                          style={[
                            styles.planetText,
                            { color: pInfo?.color ?? Colors.textPrimary },
                            pp.isRetrograde && styles.retroText,
                            pp.isCombust && styles.combustText,
                          ]}
                        >
                          {abbr}{pp.isRetrograde ? '℞' : ''}
                          {showDegrees ? `\n${pp.degree.toFixed(0)}°` : ''}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Center label */}
      <View style={[styles.centerLabel, {
        left: cellSize,
        top: cellSize,
        width: 2 * cellSize,
        height: 2 * cellSize,
      }]}>
        <Text style={styles.centerChartType}>{data.chartType ?? 'D1'}</Text>
        {data.label && <Text style={styles.centerSubLabel}>{data.label}</Text>}
      </View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: Colors.glassSurface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cell: {
    position: 'absolute',
    padding: 4,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  ascendantCell: {
    backgroundColor: 'rgba(102,126,234,0.12)',
  },
  cellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  houseNum: {
    fontSize: 9,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  signLabel: {
    fontSize: 8,
    fontFamily: FontFamily.bold,
  },
  lagnaMarker: {
    backgroundColor: 'rgba(102,126,234,0.35)',
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 1,
    marginTop: 1,
  },
  lagnaText: {
    fontSize: 7,
    fontFamily: FontFamily.bold,
    color: Colors.textGold,
  },
  planetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 2,
  },
  planetChip: {
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  planetSelected: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
  },
  planetText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  retroText: {
    opacity: 0.75,
  },
  combustText: {
    textDecorationLine: 'underline',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  centerChartType: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.glassBorderBright,
    letterSpacing: 4,
  },
  centerSubLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
