import { dark, effects, light, primitives } from '../../constants/colors';
import { layout } from '../../constants/layout';
import { typography } from '../../constants/typography';

export const theme = {
  primitives,
  modes: { light, dark },
  typography,
  layout,
  effects,
};

export type AppTheme = typeof theme;
export type ThemeColors = typeof dark;