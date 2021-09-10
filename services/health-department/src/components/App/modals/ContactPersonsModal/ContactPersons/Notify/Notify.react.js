import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useModal } from 'components/hooks/useModal';
import { getMe } from 'network/api';
import { NotificationModal } from 'components/App/modals/NotificationModal';
import { StyledLink, Wrapper, BellOutlinedIcon } from './Notify.styled';
import { filterByDeviceType } from './Notify.helper';

export const Notify = ({ traces, location }) => {
  const intl = useIntl();
  const [openModal] = useModal();
  const { data: healthDepartmentEmployee } = useQuery('me', getMe, {
    refetchOnWindowFocus: false,
  });

  const {
    uuid: locationId,
    name: locationName,
    transferId: locationTransferId,
    time,
  } = location;

  if (!traces || traces.length === 0) return null;

  const selectedFilteredTraces = filterByDeviceType(traces);
  const selectedTracesIds = selectedFilteredTraces.map(trace => trace.traceId);

  const openNotificationModal = () => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.notification.title',
      }),
      content: (
        <NotificationModal
          locationId={locationId}
          locationName={locationName}
          locationTransferId={locationTransferId}
          traceIds={selectedTracesIds}
          time={time}
          departmentId={healthDepartmentEmployee.departmentId}
        />
      ),
      wide: true,
    });
  };

  return (
    <Wrapper>
      {healthDepartmentEmployee &&
      healthDepartmentEmployee.notificationsEnabled ? (
        <StyledLink onClick={openNotificationModal}>
          <BellOutlinedIcon />
          {intl.formatMessage({
            id: 'ContactPerson.notify.title',
          })}
        </StyledLink>
      ) : null}
    </Wrapper>
  );
};
