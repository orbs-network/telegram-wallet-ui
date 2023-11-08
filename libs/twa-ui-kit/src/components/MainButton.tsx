import { MainButton as BaseMainButton } from '@twa-dev/sdk/react';
import { colors } from '../theme';
import { Button } from './Button';
import { Twa } from '../Twa';

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
  if (!Twa.initData) {
    return (
      <Button
        style={{
          pointerEvents: props.disabled ? 'none' : 'auto',
        }}
        isLoading={props.progress}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.text?.toUpperCase()}
      </Button>
    );
  }
  return (
    <BaseMainButton
      {...props}
      color={
        props.disabled || props.progress
          ? colors.button_disabed_color
          : colors.button_color
      }
      text={props.text?.toUpperCase()}
    />
  );
}
