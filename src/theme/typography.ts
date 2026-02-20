import { Platform } from 'react-native';

export const FontFamily = {
  regular:  'SpaceGrotesk-Regular',
  medium:   'SpaceGrotesk-Medium',
  bold:     'SpaceGrotesk-Bold',
  sanskrit: 'NotoSansDevanagari-Regular',
  mono:     Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
} as const;

export const FontSize = {
  xs:   10,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  display: 56,
} as const;

export const LineHeight = {
  tight:  1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const LetterSpacing = {
  tight:  -0.5,
  normal: 0,
  wide:   0.5,
  wider:  1,
  widest: 2,
} as const;

export const TextStyles = {
  displayLarge: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    lineHeight: FontSize.display * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.normal,
  },
  h4: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.normal,
  },
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.relaxed,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    letterSpacing: LetterSpacing.wide,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    letterSpacing: LetterSpacing.wide,
  },
  planetSymbol: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
} as const;
