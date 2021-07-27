import { useEffect, useRef } from 'react';
import { wrap, releaseProxy } from 'comlink';

export const useWorker = (worker, cleanup) => {
  const workerReference = useRef();
  const workerApiReference = useRef();

  useEffect(() => {
    workerReference.current = worker;
    workerApiReference.current = wrap(workerReference.current);
    return () => {
      workerApiReference.current[releaseProxy]();
      worker.terminate();
      setTimeout(cleanup, 2000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return workerApiReference;
};
