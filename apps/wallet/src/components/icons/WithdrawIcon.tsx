import { Icon, IconProps } from '@chakra-ui/react';

export function WithdrawIcon(props: IconProps) {
  return (
    <Icon width="32px" height="32px" viewBox="0 0 28 28" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 3C7.925 3 3 7.925 3 14s4.925 11 11 11 11-4.925 11-11S20.075 3 14 3Zm4.53 9.47-4-4a.75.75 0 0 0-1.06 0l-4 4a.75.75 0 1 0 1.06 1.06l2.72-2.72V19a.75.75 0 0 0 1.5 0v-8.19l2.72 2.72a.75.75 0 1 0 1.06-1.06Z"
        fill="currentColor"
      ></path>
    </Icon>
  );
}
