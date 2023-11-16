import { Icon, IconProps } from '@chakra-ui/react';

export function BuyIcon(props: IconProps) {
  return (
    <Icon width="32px" height="32px" viewBox="0 0 28 28" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 14C3 7.925 7.925 3 14 3s11 4.925 11 11-4.925 11-11 11S3 20.075 3 14Zm11-5.75a.75.75 0 0 1 .75.75v4.25H19a.75.75 0 0 1 0 1.5h-4.25V19a.75.75 0 0 1-1.5 0v-4.25H9a.75.75 0 0 1 0-1.5h4.25V9a.75.75 0 0 1 .75-.75Z"
        fill="currentColor"
      ></path>{' '}
    </Icon>
  );
}
