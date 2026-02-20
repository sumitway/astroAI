import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@theme/index';

const { width, height } = Dimensions.get('window');

const NUM_STARS = 120;

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  delay: number;
}

function generateStars(): Star[] {
  return Array.from({ length: NUM_STARS }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    opacity: new Animated.Value(Math.random()),
    delay: Math.random() * 3000,
  }));
}

const STARS = generateStars();

interface CosmicBackgroundProps {
  children?: React.ReactNode;
  animated?: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  children,
  animated = true,
}) => {
  const nebulaOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!animated) return;

    // Animate star twinkle
    STARS.forEach(star => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 0.1 + Math.random() * 0.9,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.1 + Math.random() * 0.5,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(twinkle);
      };
      setTimeout(twinkle, star.delay);
    });

    // Animate nebula pulse
    const nebulaPulse = () => {
      Animated.sequence([
        Animated.timing(nebulaOpacity, {
          toValue: 0.5,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(nebulaOpacity, {
          toValue: 0.25,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(nebulaPulse);
    };
    nebulaPulse();
  }, [animated]);

  return (
    <View style={styles.container}>
      {/* Base deep space gradient */}
      <LinearGradient
        colors={[Colors.cosmicVoid, Colors.deepSpace, Colors.nebulaDark, '#1a1040']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Nebula glow layers */}
      <Animated.View
        style={[
          styles.nebula,
          styles.nebulaPurple,
          { opacity: nebulaOpacity },
        ]}
      />
      <Animated.View
        style={[
          styles.nebula,
          styles.nebulaBlue,
          { opacity: nebulaOpacity },
        ]}
      />

      {/* Stars */}
      {STARS.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      {/* Content */}
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cosmicVoid,
  },
  nebula: {
    position: 'absolute',
    borderRadius: 9999,
  },
  nebulaPurple: {
    width: 300,
    height: 300,
    top: -80,
    left: -80,
    backgroundColor: 'rgba(102,126,234,0.15)',
  },
  nebulaBlue: {
    width: 250,
    height: 250,
    bottom: 100,
    right: -60,
    backgroundColor: 'rgba(118,75,162,0.12)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});
