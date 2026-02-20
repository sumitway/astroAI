import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { Colors, FontFamily, FontSize } from '@theme/index';

interface CosmicLoaderProps {
  size?: number;
  label?: string;
  color?: string;
}

export const CosmicLoader: React.FC<CosmicLoaderProps> = ({
  size = 64,
  label,
  color = Colors.primary,
}) => {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.6)).current;
  const orbitSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(orbitSpin, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotation = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const orbitRotation = orbitSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });

  const orbitRadius = size * 0.45;
  const dotSize = size * 0.12;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer ring */}
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color + '44',
              transform: [{ rotate: rotation }],
            },
          ]}
        />
        {/* Inner ring */}
        <Animated.View
          style={[
            styles.ring,
            styles.ringInner,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: size * 0.35,
              borderColor: color + '77',
              transform: [{ rotate: orbitRotation }],
            },
          ]}
        />
        {/* Center dot */}
        <Animated.View
          style={[
            styles.centerDot,
            {
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
              backgroundColor: color,
              opacity: pulse,
            },
          ]}
        />
        {/* Orbiting dot */}
        <Animated.View
          style={[
            styles.orbitDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: Colors.textGold,
              top: size / 2 - dotSize / 2 - orbitRadius,
              transform: [{ rotate: rotation }],
            },
          ]}
        />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  ringInner: {
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerDot: {
    position: 'absolute',
  },
  orbitDot: {
    position: 'absolute',
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
});
