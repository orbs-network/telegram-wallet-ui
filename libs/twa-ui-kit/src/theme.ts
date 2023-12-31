import {
  ThemeConfig,
  defineStyle,
  defineStyleConfig,
  extendTheme,
} from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { adjustBrightness, hexToRgba } from './utils';
import { Twa } from './Twa';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

// Telegram theme colours as of 09/10/2023
export const tgColors = {
  dark: {
    bg_color: '#18222d',
    button_color: '#2ea6ff',
    button_text_color: '#ffffff',
    hint_color: '#b1c3d5',
    link_color: '#62bcf9',
    secondary_bg_color: '#131415',
    text_color: '#ffffff',
  },

  light: {
    bg_color: '#ffffff',
    button_color: '#2481cc',
    button_text_color: '#ffffff',
    hint_color: '#999999',
    link_color: '#2481cc',
    secondary_bg_color: '#efeff3',
    text_color: '#000000',
  },
};

export function twaMode(light: string | undefined, dark: string | undefined) {
  if (!Twa.colorScheme) return light;
  return Twa.colorScheme === 'light' ? light : dark;
}

export function setTwaBg(isAlt: boolean) {
  if (!Twa) return;

  const color = isAlt ? 'bg_color' : 'secondary_bg_color';
  Twa.setHeaderColor(color);
  Twa.setBackgroundColor(color);
}

export const colors = {
  bg_color:
    Twa.themeParams.bg_color ||
    twaMode(tgColors.light.bg_color, tgColors.dark.bg_color),
  button_color:
    Twa.themeParams.button_color ||
    twaMode(tgColors.light.button_color, tgColors.dark.button_color),
  button_text_color:
    Twa.themeParams.button_text_color ||
    twaMode(tgColors.light.button_text_color, tgColors.dark.button_text_color),
  hint_color:
    Twa.themeParams.hint_color ||
    twaMode(tgColors.light.hint_color, tgColors.dark.hint_color),
  link_color:
    Twa.themeParams.link_color ||
    twaMode(tgColors.light.link_color, tgColors.dark.link_color),
  secondary_bg_color:
    Twa.themeParams.secondary_bg_color ||
    twaMode(
      tgColors.light.secondary_bg_color,
      tgColors.dark.secondary_bg_color
    ),
  secondary_bg_color2: twaMode(
    'rgba(116, 116, 128, 0.08)',
    'rgba(116, 116, 128, 0.18);'
  ),
  text_color:
    Twa.themeParams.text_color ||
    twaMode(tgColors.light.text_color, tgColors.dark.text_color),
  border_color: twaMode('rgb(239, 239, 243);', '#3d3d3f'),
  button_disabed_color: twaMode('#999999', '#333333'),
  success: twaMode('#34c759', '#4cd964'),
};

const config: ThemeConfig = {
  initialColorMode: Twa.colorScheme,
  useSystemColorMode: false,
};

const secondary_button_color = hexToRgba(colors.button_color, 0.1);

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'ui-rounded',  sans-serif`,
    body: `'ui-rounded', sans-serif`,
  },
  styles: {
    global: {
      body: {
        color: colors.text_color,
        backgroundColor: colors.secondary_bg_color,
      },
      a: {
        color: colors.link_color,
      },
    },
  },
  components: {
    Heading: defineStyleConfig({
      variants: {
        bodyTitle: {
          // 17px to rem
          fontSize: '1.0625rem',
          fontWeight: 'medium',
        },
      },
    }),
    Card: defineStyleConfig({
      baseStyle: {
        backgroundColor: colors.bg_color,
        color: colors.text_color,
        borderRadius: '0.875rem',
      },
    }),
    Text: defineStyleConfig({
      variants: {
        hint: {
          color: colors.hint_color,
          fontSize: '0.9375rem',
        },
        bodyText: {
          fontSize: '1.0625rem',
        },
      },
    }),
    Button: defineStyleConfig({
      defaultProps: {
        size: 'lg',
      },
      baseStyle: {
        width: '100%',
        borderRadius: '0.875rem',
        fontSize: '1rem',
      },
      variants: {
        primary: {
          backgroundColor: colors.button_color,
          color: colors.button_text_color,
          _hover: {
            backgroundColor: adjustBrightness(colors.button_color, -0.07),
          },
          // This is ignored for some reason
          fontSize: '1rem',
        },
        secondary: {
          backgroundColor: `var(--secondary-button-color, ${secondary_button_color})`,
          color: colors.button_color,
          _hover: {
            backgroundColor: `var(--secondary-button-color, ${secondary_button_color})`,
          },
          fontSize: '1rem',
        },
        icon: {
          padding: '0.5rem',
          width: 'auto',
          height: 'auto',
          fontSize: '0.875rem',
          color: colors.button_color,
          _hover: {
            color: adjustBrightness(colors.button_color, -0.1),
          },
        },
      },
    }),
    Input: defineMultiStyleConfig({
      defaultProps: {
        variant: 'filled',
      },
      variants: {
        filled: definePartsStyle({
          field: {
            backgroundColor: colors.secondary_bg_color,
            borderRadius: '0.875rem',
            _placeholder: {
              color: colors.hint_color,
            },
            _hover: {
              backgroundColor: adjustBrightness(
                colors.secondary_bg_color,
                -0.07
              ),
            },
            _active: {
              backgroundColor: adjustBrightness(
                colors.secondary_bg_color,
                -0.07
              ),
            },
            _focus: {
              backgroundColor: adjustBrightness(
                colors.secondary_bg_color,
                -0.07
              ),
            },
            _dark: {
              backgroundColor: colors.secondary_bg_color,
            },
          },
        }),
      },
    }),
    Divider: defineStyleConfig({
      variants: {
        thick: defineStyle({
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: 'gray.400',
          borderRadius: 6,
        }),
      },
    }),
    Icon: defineStyleConfig({
      baseStyle: {
        fontSize: '2xl',
      },
    }),
  },
});
