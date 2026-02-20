export { Colors } from './colors';
export { FontFamily, FontSize, TextStyles, LineHeight, LetterSpacing } from './typography';
export { Spacing, BorderRadius, Shadow } from './spacing';

export const Theme = {
  dark: true,
  colors: {
    primary:    '#667EEA',
    secondary:  '#764BA2',
    background: '#03000F',
    card:       '#0D0B2A',
    text:       'rgba(255,255,255,0.95)',
    border:     'rgba(255,255,255,0.12)',
    notification: '#FF6B6B',
  },
} as const;
