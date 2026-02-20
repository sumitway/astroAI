export { Colors } from './colors';
export { FontFamily, FontSize, TextStyles, LineHeight, LetterSpacing } from './typography';
export { Spacing, BorderRadius, Shadow } from './spacing';

export const Theme = {
  dark: true,
  colors: {
    primary:      '#D4891A',   // saffron amber
    secondary:    '#8B2500',   // deep vermillion
    background:   '#0C0804',   // warm dark
    card:         '#1A1008',   // warm card
    text:         'rgba(255,245,230,0.95)',
    border:       'rgba(212,137,26,0.20)',
    notification: '#FF6B6B',
  },
} as const;
