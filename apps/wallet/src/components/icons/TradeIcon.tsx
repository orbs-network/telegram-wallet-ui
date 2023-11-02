import { Icon, IconProps } from '@chakra-ui/react';

export function TradeIcon(props: IconProps) {
  return (
    <Icon width="32px" height="32px" viewBox="0 0 28 29" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 14.5c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11Zm9.303-5.97c.26.26.26.68 0 .94l-1.364 1.365h7.394a.665.665 0 1 1 0 1.33H10.94l1.364 1.365a.665.665 0 1 1-.94.94l-2.5-2.5a.665.665 0 0 1 0-.94l2.5-2.5c.26-.26.68-.26.94 0Zm3.557 6.94a.665.665 0 1 1 .94-.94l2.5 2.5a.665.665 0 0 1 0 .94l-2.5 2.5a.665.665 0 1 1-.94-.94l1.365-1.365H9.83a.665.665 0 1 1 0-1.33h7.395L15.86 15.47Z"
        fill="currentColor"
      ></path>
    </Icon>
  );
}
