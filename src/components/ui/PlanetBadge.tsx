import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize } from '@theme/index';
import { PLANETS, PLANET_ABBREVIATIONS } from '@constants/planets';

interface PlanetBadgeProps {
  planetId: string;
  sign?: number;
  degree?: number;
  isRetrograde?: boolean;
  isCombust?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDegree?: boolean;
  onPress?: () => void;
}

export const PlanetBadge: React.FC<PlanetBadgeProps> = ({
  planetId,
  sign,
  degree,
  isRetrograde = false,
  isCombust = false,
  size = 'md',
  showDegree = false,
  onPress,
}) => {
  const planet = PLANETS.find(p => p.id === planetId);
  const abbr = PLANET_ABBREVIATIONS[planetId] || planetId.slice(0, 2).toUpperCase();
  const color = planet?.color ?? Colors.textPrimary;

  const sizeStyles = {
    sm: { badge: styles.badgeSm, symbol: styles.symbolSm, label: styles.labelSm },
    md: { badge: styles.badgeMd, symbol: styles.symbolMd, label: styles.labelMd },
    lg: { badge: styles.badgeLg, symbol: styles.symbolLg, label: styles.labelLg },
  }[size];

  const content = (
    <View style={[styles.badge, sizeStyles.badge, { borderColor: color + '55' }]}>
      <Text style={[sizeStyles.symbol, { color }]}>
        {planet?.symbol ?? '★'}
      </Text>
      <Text style={[sizeStyles.label, { color }]}>
        {abbr}{isRetrograde ? '℞' : ''}
      </Text>
      {isCombust && <View style={[styles.combustDot, { backgroundColor: Colors.planets.sun }]} />}
      {showDegree && degree !== undefined && (
        <Text style={[styles.degree, { color: color + 'AA' }]}>
          {degree.toFixed(1)}°
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassSurface,
    borderWidth: 1,
    borderRadius: 8,
    gap: 1,
  },
  badgeSm: { paddingHorizontal: 6, paddingVertical: 4, minWidth: 32 },
  badgeMd: { paddingHorizontal: 10, paddingVertical: 6, minWidth: 44 },
  badgeLg: { paddingHorizontal: 14, paddingVertical: 10, minWidth: 56 },
  symbolSm: { fontSize: 12, fontFamily: FontFamily.regular },
  symbolMd: { fontSize: 18, fontFamily: FontFamily.regular },
  symbolLg: { fontSize: 24, fontFamily: FontFamily.regular },
  labelSm: { fontSize: FontSize['2xs'] ?? 9, fontFamily: FontFamily.bold },
  labelMd: { fontSize: FontSize.xs, fontFamily: FontFamily.bold },
  labelLg: { fontSize: FontSize.sm, fontFamily: FontFamily.bold },
  degree: { fontSize: 8, fontFamily: FontFamily.regular },
  combustDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 3,
    opacity: 0.8,
  },
});
