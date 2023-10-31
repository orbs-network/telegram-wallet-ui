import {
  StyleFunctionProps,
  ThemeConfig,
  defineStyle,
  defineStyleConfig,
  extendTheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import Twa from '@twa-dev/sdk';
import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { adjustBrightness } from './utils';

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

export function twaMode(light: string, dark: string) {
  if (!Twa.colorScheme) return light;
  return Twa.colorScheme === 'light' ? light : dark;
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
  text_color:
    Twa.themeParams.text_color ||
    twaMode(tgColors.light.text_color, tgColors.dark.text_color),
};

const config: ThemeConfig = {
  initialColorMode: Twa.colorScheme,
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color:
          Twa.themeParams.text_color ||
          mode(tgColors.light.text_color, tgColors.dark.text_color)(props),
        backgroundColor:
          twaMode(
            Twa.themeParams.secondary_bg_color,
            Twa.themeParams.bg_color
          ) ||
          mode(
            tgColors.light.secondary_bg_color,
            tgColors.dark.bg_color
          )(props),
      },
      a: {
        color:
          Twa.themeParams.link_color ||
          mode(tgColors.light.link_color, tgColors.dark.link_color)(props),
      },
    }),
  },
  components: {
    Heading: defineStyleConfig({
      variants: {
        bodyTitle: {
          fontSize: '1rem',
          fontWeight: 'medium',
        },
      },
    }),
    Card: defineStyleConfig({
      baseStyle: {
        backgroundColor: (props) =>
          twaMode(
            Twa.themeParams.bg_color,
            Twa.themeParams.secondary_bg_color
          ) ||
          mode(
            tgColors.light.bg_color,
            tgColors.dark.secondary_bg_color
          )(props),
      },
    }),
    Text: defineStyleConfig({
      variants: {
        hint: {
          color: (props) =>
            Twa.themeParams.hint_color ||
            mode(tgColors.light.hint_color, tgColors.dark.hint_color)(props),
          fontSize: '0.875rem',
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
        primary: (props) => ({
          backgroundColor:
            Twa.themeParams.button_color ||
            mode(
              tgColors.light.button_color,
              tgColors.dark.button_color
            )(props),
          color:
            Twa.themeParams.button_text_color ||
            mode(
              tgColors.light.button_text_color,
              tgColors.dark.button_text_color
            )(props),
          _hover: {
            backgroundColor: adjustBrightness(
              Twa.themeParams.button_color ||
                mode(
                  tgColors.light.button_color,
                  tgColors.dark.button_color
                )(props),
              -0.07
            ),
          },
          // This is ignored for some reason
          fontSize: '1rem',
        }),
        secondary: (props) => ({
          backgroundColor: 'transparent',
          fontSize: '1rem',
          color:
            Twa.themeParams.button_color ||
            mode(
              tgColors.light.button_color,
              tgColors.dark.button_color
            )(props),
          _hover: {
            color: adjustBrightness(
              Twa.themeParams.button_color ||
                mode(
                  tgColors.light.button_color,
                  tgColors.dark.button_color
                )(props),
              -0.1
            ),
          },
        }),
        tertiary: (props) => ({
          backgroundColor: '#DEE4EE',
          color:
            Twa.themeParams.button_color ||
            mode(
              tgColors.light.button_color,
              tgColors.dark.button_color
            )(props),
          _hover: {
            backgroundColor: adjustBrightness('#DEE4EE', -0.07),
          },
          fontSize: '1rem',
        }),
        icon: (props) => ({
          padding: '0.5rem',
          width: 'auto',
          height: 'auto',
          fontSize: '0.875rem',
          color:
            Twa.themeParams.button_color ||
            mode(
              tgColors.light.button_color,
              tgColors.dark.button_color
            )(props),
          _hover: {
            color: adjustBrightness(
              Twa.themeParams.button_color ||
                mode(
                  tgColors.light.button_color,
                  tgColors.dark.button_color
                )(props),
              -0.1
            ),
          },
        }),
      },
    }),
    Input: defineMultiStyleConfig({
      defaultProps: {
        variant: 'filled',
      },
      variants: {
        filled: definePartsStyle({
          field: {
            backgroundColor:
              Twa.themeParams.bg_color || tgColors.light.bg_color,
            borderRadius: '0.875rem',
            _hover: {
              backgroundColor: adjustBrightness(
                Twa.themeParams.bg_color || tgColors.light.bg_color,
                -0.07
              ),
            },
            _dark: {
              backgroundColor:
                Twa.themeParams.bg_color || tgColors.light.bg_color,
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
