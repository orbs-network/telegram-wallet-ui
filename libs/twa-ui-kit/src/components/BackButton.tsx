import { FC, useEffect } from 'react';
import { Twa } from '../Twa';

interface BackButtonProps {
  onClick?: VoidFunction;
}

const backButton = Twa.BackButton;

let isButtonShown = false;

export const BackButton: FC<BackButtonProps> = ({
  onClick = () => {
    window.history.back();
  },
}) => {
  useEffect(() => {
    backButton.show();
    isButtonShown = true;
    return () => {
      isButtonShown = false;
      setTimeout(() => {
        if (!isButtonShown) {
          backButton.hide();
        }
      }, 10);
    };
  }, []);

  useEffect(() => {
    Twa.onEvent('backButtonClicked', onClick);
    return () => {
      Twa.offEvent('backButtonClicked', onClick);
    };
  }, [onClick]);

  return null;
};
