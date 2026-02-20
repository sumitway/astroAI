import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, FontFamily, FontSize, BorderRadius, Spacing } from '@theme/index';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'golden' | 'aurora' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const VARIANTS = {
  primary:   Colors.gradients.cosmic,
  secondary: Colors.gradients.moon,
  golden:    Colors.gradients.golden,
  aurora:    Colors.gradients.aurora,
  ghost:     ['transparent', 'transparent'] as const,
};

const SIZES = {
  sm: { paddingVertical: Spacing['2'],  paddingHorizontal: Spacing['4'],  fontSize: FontSize.sm },
  md: { paddingVertical: Spacing['3'],  paddingHorizontal: Spacing['6'],  fontSize: FontSize.base },
  lg: { paddingVertical: Spacing['4'],  paddingHorizontal: Spacing['8'],  fontSize: FontSize.md },
};

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const isGhost = variant === 'ghost';
  const sizeStyle = SIZES[size];

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={VARIANTS[variant] as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          isGhost && styles.ghostBorder,
          {
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                { fontSize: sizeStyle.fontSize },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2'],
    borderRadius: BorderRadius.full,
  },
  ghostBorder: {
    borderWidth: 1.5,
    borderColor: Colors.glassBorderBright,
  },
  text: {
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
});
