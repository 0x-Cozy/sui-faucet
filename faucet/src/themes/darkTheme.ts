import type { ThemeVars } from '@mysten/dapp-kit';

export const darkTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(0)',
  },
  backgroundColors: {
    primaryButton: '#030F1C',
    primaryButtonHover: '#011829',
    outlineButtonHover: '#011829',
    modalOverlay: 'rgba(0 0 0 / 80%)',
    modalPrimary: '#030F1C',
    modalSecondary: '#011829',
    iconButton: 'transparent',
    iconButtonHover: '#011829',
    dropdownMenu: '#030F1C',
    dropdownMenuSeparator: '#4DA2FF',
    walletItemSelected: '#011829',
    walletItemHover: '#011829',
  },
  borderColors: {
    outlineButton: '#4DA2FF',
  },
  colors: {
    primaryButton: '#FFFFFF',
    outlineButton: '#FFFFFF',
    iconButton: '#FFFFFF',
    body: '#FFFFFF',
    bodyMuted: '#A0A0A0',
    bodyDanger: '#FF6B6B',
  },
  radii: {
    small: '2px',
    medium: '4px',
    large: '6px',
    xlarge: '8px',
  },
  shadows: {
    primaryButton: '0 0 3px rgba(111,188,240,0.6)',
    walletItemSelected: '0 0 3px rgba(111,188,240,0.6)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px',
  },
  typography: {
    fontFamily: 'Space Mono, monospace',
    fontStyle: 'normal',
    lineHeight: '1.3',
    letterSpacing: '0.5px',
  },
}; 