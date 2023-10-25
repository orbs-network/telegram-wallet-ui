import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type CountdownProps = {
  seconds: number;
  onAsyncComplete?: () => Promise<void>;
};

export function Countdown({
  seconds,
  onAsyncComplete,
}: CountdownProps): React.ReactElement {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (time > 0) {
          return time - 1;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time === 0) {
      if (onAsyncComplete) {
        const asyncCallback = async () => {
          await onAsyncComplete();
          setTime(seconds);
        };

        asyncCallback();
      } else {
        setTime(seconds);
      }
    }
  }, [onAsyncComplete, seconds, time]);

  const progress = 100 - (time / seconds) * 100;

  return (
    <CircularProgress value={progress}>
      <CircularProgressLabel>{time}</CircularProgressLabel>
    </CircularProgress>
  );
}
