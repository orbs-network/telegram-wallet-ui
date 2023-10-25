import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

type CountdownProps = {
  progress: number;
  time: number;
};

export function Countdown({
  progress,
  time,
}: CountdownProps): React.ReactElement {
  return (
    <CircularProgress value={progress}>
      <CircularProgressLabel>{time}</CircularProgressLabel>
    </CircularProgress>
  );
}
