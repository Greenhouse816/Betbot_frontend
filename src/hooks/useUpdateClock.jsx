import { useState } from 'react';

const useUpdateClock = () => {
  const [, setForceUpdate] = useState();
  return () => setForceUpdate({});
};

export default useUpdateClock;
