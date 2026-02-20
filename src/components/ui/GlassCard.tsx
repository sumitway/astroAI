import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Shadow, Spacing } from '@theme/index';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  intensity?: number;
  borderGlow?: string;
  padding?: number;
  rounded?: keyof typeof BorderRadius;
  onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  gradient = false,
  gradientColors = Colors.gradients.cosmic,
  intensity = 20,
  borderGlow,
  padding = Spacing['4'],
  rounded = 'xl',
}) => {
  const borderStyle = borderGlow
    ? { borderColor: borderGlow, borderWidth: 1.5, ...Shadow.glow(borderGlow) }
    : { borderColor: Colors.glassBorder, borderWidth: 1 };

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.base,
          { borderRadius: BorderRadius[rounded], padding },
          borderStyle,
          style,
        ]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[
        styles.base,
        { borderRadius: BorderRadius[rounded], padding },
        borderStyle,
        style,
      ]}
    >
      <View style={[styles.inner, { borderRadius: BorderRadius[rounded] }]}>
        {children}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.glassSurface,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
  },
});
