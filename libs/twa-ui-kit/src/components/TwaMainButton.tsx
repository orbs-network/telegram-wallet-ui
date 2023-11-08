import { FC, useEffect } from 'react';
import { Twa } from '../Twa';

interface TwaMainButtonProps {
  disabled?: boolean;
  progress?: boolean;
  color?: string;
  textColor?: string;
  onClick: VoidFunction;
  text: string;
}

const mainButton = Twa.MainButton;
const { button_color, button_text_color } = Twa.themeParams;

export const TwaMainButton: FC<TwaMainButtonProps> = ({
  disabled,
  color,
  textColor,
  text,
  onClick,
  progress,
}) => {
  useEffect(() => {
    return () => {
      mainButton.hide();
      mainButton.enable();
      mainButton.hideProgress();
      mainButton.setParams({
        color: button_color,
        text_color: button_text_color,
      });
    };
  }, []);

  useEffect(() => {
    if (typeof progress === 'boolean') {
      if (progress) {
        mainButton.showProgress();
        mainButton.disable();
      } else {
        mainButton.hideProgress();
      }
    }
    if (typeof disabled === 'boolean') {
      disabled || progress ? mainButton.disable() : mainButton.enable();
    }
  }, [disabled, progress]);

  useEffect(() => {
    if (color || textColor) {
      mainButton.setParams({ color, text_color: textColor });
    }
  }, [color, textColor]);

  useEffect(() => {
    if (text) {
      mainButton.setText(text);
      !mainButton.isVisible && mainButton.show();
    } else if (mainButton.isVisible) {
      mainButton.hide();
    }
  }, [text]);

  useEffect(() => {
    if (onClick) {
      Twa.MainButton.onClick(onClick);
      return () => {
        Twa.MainButton.offClick(onClick);
      };
    }
  }, [onClick]);

  return null;
};
