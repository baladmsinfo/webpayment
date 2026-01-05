import colors from 'vuetify/util/colors'

export const staticPrimaryColor = '#001F3D'
export const staticPrimaryDarkenColor = '#001733'

export const themes = {
  light: {
    dark: false,
    colors: {
      primary: staticPrimaryColor,
      'on-primary': '#FFFFFF',
      'primary-darken-1': staticPrimaryDarkenColor,

      secondary: '#424242',
      'secondary-darken-1': '#333333',
      'on-secondary': '#FFFFFF',

      success: '#388E3C',
      'success-darken-1': '#2E7D32',
      'on-success': '#FFFFFF',

      info: '#1976D2',
      'info-darken-1': '#1565C0',
      'on-info': '#FFFFFF',

      warning: '#F57C00',
      'warning-darken-1': '#EF6C00',
      'on-warning': '#FFFFFF',

      error: '#D32F2F',
      'error-darken-1': '#C62828',
      'on-error': '#FFFFFF',

      background: '#EBF4DD',
      'on-background': '#001F3D',

      surface: '#FFFFFF',
      'on-surface': '#001F3D',

      'grey-50': '#FAFAFA',
      'grey-100': '#F5F5F5',
      'grey-200': '#EEEEEE',
      'grey-300': '#E0E0E0',
      'grey-400': '#BDBDBD',
      'grey-500': '#9E9E9E',
      'grey-600': '#757575',
      'grey-700': '#616161',
      'grey-800': '#424242',
      'grey-900': '#212121',

      'perfect-scrollbar-thumb': '#D6D6D6',
      'skin-bordered-background': '#FFFFFF',
      'skin-bordered-surface': '#FFFFFF',
      'expansion-panel-text-custom-bg': '#F6F7F9',
      'track-bg': '#F0F2F8',
      'chat-bg': '#F7F6FA',
    },
    variables: {
      'code-color': '#001F3D',
      'overlay-scrim-background': '#001F3D',
      'tooltip-background': '#001733',
      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.04,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.4,
      'border-color': '#001F3D',
      'border-opacity': 0.12,
      'table-header-color': '#F6F7FB',
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,

      // shadows
      'shadow-key-umbra-color': '#001F3D',
      'shadow-xs-opacity': '0.16',
      'shadow-sm-opacity': '0.18',
      'shadow-md-opacity': '0.20',
      'shadow-lg-opacity': '0.22',
      'shadow-xl-opacity': '0.24',
    },
  },

  dark: {
    dark: true,
    colors: {
      primary: staticPrimaryColor,
      'on-primary': '#FFFFFF',
      'primary-darken-1': staticPrimaryDarkenColor,

      secondary: '#424242',
      'secondary-darken-1': '#333333',
      'on-secondary': '#FFFFFF',

      success: '#4CAF50',
      'success-darken-1': '#43A047',
      'on-success': '#FFFFFF',

      info: '#2196F3',
      'info-darken-1': '#1E88E5',
      'on-info': '#FFFFFF',

      warning: '#FB8C00',
      'warning-darken-1': '#F57C00',
      'on-warning': '#FFFFFF',

      error: '#FF5252',
      'error-darken-1': '#E53935',
      'on-error': '#FFFFFF',

      background: '#121212',
      'on-background': '#EBF4DD',

      surface: '#1E1E1E',
      'on-surface': '#EBF4DD',

      'grey-50': '#2A2E42',
      'grey-100': '#2F3349',
      'grey-200': '#4A5072',
      'grey-300': '#5E6692',
      'grey-400': '#7983BB',
      'grey-500': '#8692D0',
      'grey-600': '#AAB3DE',
      'grey-700': '#B6BEE3',
      'grey-800': '#CFD3EC',
      'grey-900': '#E7E9F6',

      'perfect-scrollbar-thumb': '#4A5072',
      'skin-bordered-background': '#1E1E1E',
      'skin-bordered-surface': '#1E1E1E',
      'expansion-panel-text-custom-bg': '#232323',
      'track-bg': '#2C2C2C',
      'chat-bg': '#242424',
    },
    variables: {
      'code-color': '#EBF4DD',
      'overlay-scrim-background': '#1E1E1E',
      'tooltip-background': '#EBF4DD',
      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.04,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'disabled-opacity': 0.4,
      'dragged-opacity': 0.1,
      'border-color': '#EBF4DD',
      'border-opacity': 0.12,
      'table-header-color': '#232323',
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,

      // shadows
      'shadow-key-umbra-color': '#000000',
      'shadow-xs-opacity': '0.20',
      'shadow-sm-opacity': '0.22',
      'shadow-md-opacity': '0.24',
      'shadow-lg-opacity': '0.26',
      'shadow-xl-opacity': '0.28',
    },
  },
}

export default themes