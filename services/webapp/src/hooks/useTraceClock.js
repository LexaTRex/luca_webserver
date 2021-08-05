import { useEffect, useState } from 'react';
import moment from 'moment';
import { useUserSession } from 'contexts/userSessionContext';

export const useTraceClock = () => {
  const { checkin } = useUserSession();
  const [clock, setClock] = useState(
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setClock(moment.duration(moment().diff(moment.unix(checkin))));
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  });

  return {
    allowCheckout: clock.minutes() >= 2,
    hour: clock ? clock.hours().toString().padStart(2, '0') : '00',
    minute: clock ? clock.minutes().toString().padStart(2, '0') : '00',
    seconds: clock ? clock.seconds().toString().padStart(2, '0') : '00',
  };
};
