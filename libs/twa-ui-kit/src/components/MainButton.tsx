import { MainButton as BaseMainButton } from '@twa-dev/sdk/react';
import Telegram from '@twa-dev/sdk';
import { colors } from '../theme';
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
      color={props.disabled ? colors.button_disabed_color : colors.button_color}
    />
  );
}
