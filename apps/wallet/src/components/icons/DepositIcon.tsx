import { Icon, IconProps } from '@chakra-ui/react';

export function DepositIcon(props: IconProps) {
  return (
    <Icon width="32px" height="32px" viewBox="0 0 28 28" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 25c6.075 0 11-4.925 11-11S20.075 3 14 3 3 7.925 3 14s4.925 11 11 11Zm-3.434-10.566a.8.8 0 0 0-1.132 1.132l4 4a.8.8 0 0 0 1.132 0l4-4a.8.8 0 0 0-1.132-1.132L14.8 17.07V9.5a.8.8 0 0 0-1.6 0v7.569l-2.634-2.635Z"
        fill="currentColor"
      ></path>
    </Icon>
  );
}
