import React from 'react';
import { MainButton as BaseMainButton } from '@twa-dev/sdk/react';
import Telegram from '@twa-dev/sdk';
import { useColorMode } from '@chakra-ui/react';
import { tgColors } from '../theme';
import { Button } from './Button';

interface MainButtonProps {
  disabled?: boolean;
  progress?: boolean;
  color?: string;
  textColor?: string;
  onClick: VoidFunction;
  text: string;
}

export function MainButton(props: MainButtonProps) {
  const mode = useColorMode();

  // if not webapp
  if (!Telegram.initData) {
    return (
      <Button
        style={{
          pointerEvents: props.disabled ? 'none' : 'auto',
        }}
        isLoading={props.progress}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.text}
      </Button>
    );
  }
  return (
    <BaseMainButton
      {...props}
      color={props.disabled ? '#CDCDCD' : tgColors[mode.colorMode].button_color}
    />
  );
}
