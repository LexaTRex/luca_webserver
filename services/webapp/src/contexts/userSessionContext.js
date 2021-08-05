import React from 'react';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { LUCA_CHECKIN_KEY } from 'helper';

/** Context * */
const defaultValues = { checkin: null };
const UserSessionContext = React.createContext(defaultValues);

/** Provider * */
export const UserSessionProvider = ({
  children,
  defaultValue = defaultValues,
}) => {
  const [checkInTimeStamp, setCheckInTimeStamp] = useLocalStorage(
    LUCA_CHECKIN_KEY,
    defaultValue.checkin
  );

  return (
    <UserSessionContext.Provider
      value={{
        checkin: checkInTimeStamp,
        setCheckin: setCheckInTimeStamp,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

/** Hook * */
export const useUserSession = () => {
  return React.useContext(UserSessionContext);
};
