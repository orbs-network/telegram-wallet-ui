import { useState, useEffect, useCallback } from 'react';

type CountdownProps = {
  seconds: number;
  onAsyncComplete?: () => Promise<void>;
};

export function useCountdown({ seconds, onAsyncComplete }: CountdownProps) {
  const [time, setTime] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    setTime(seconds);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [seconds, timer]);

  useEffect(() => {
    if (!running) {
      return () => {
        if (timer) {
          clearInterval(timer);
          setTimer(null);
        }
      };
    }

    if (timer) {
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => {
        if (t > 0) {
          return t - 1;
        }
        return 0;
      });
    }, 1000);
    setTimer(interval);

    return () => {
      stop();
    };
  }, [running, stop, timer]);

  useEffect(() => {
    if (time === 0) {
      if (onAsyncComplete) {
        const asyncCallback = async () => {
          try {
            await onAsyncComplete();
            setTime(seconds);
          } catch (err) {
            console.error('onAsyncComplete error:', err);
            stop();
            throw err;
          }
        };

        asyncCallback();
      } else {
        setTime(seconds);
      }
    }
  }, [onAsyncComplete, running, seconds, stop, time]);

  const progress = 100 - (time / seconds) * 100;

  return {
    progress,
    time,
    reset: () => setTime(seconds),
    start: () => setRunning(true),
    stop,
  };
}
