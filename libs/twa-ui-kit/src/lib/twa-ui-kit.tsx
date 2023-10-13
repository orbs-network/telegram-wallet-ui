import styles from './twa-ui-kit.module.css';

/* eslint-disable-next-line */
export interface TwaUiKitProps {}

export function TwaUiKit(props: TwaUiKitProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TwaUiKit!</h1>
    </div>
  );
}

export default TwaUiKit;
