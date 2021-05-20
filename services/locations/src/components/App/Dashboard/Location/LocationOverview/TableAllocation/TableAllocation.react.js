import React from 'react';
import { useIntl } from 'react-intl';

// API
import { getMe, getPrivateKeySecret } from 'network/api';

// Utils
import { usePrivateKey } from 'utils/privateKey';

// Components
import { useModal } from 'components/hooks/useModal';
import { PrivateKeyLoader } from 'components/PrivateKeyLoader';
import { TableAllocationModal } from 'components/App/modals/TableAllocationModal';
import { useQuery } from 'react-query';
import { TableAllocationWrapper, LinkButton } from './TableAllocation.styled';

export const TableAllocation = ({ location }) => {
  const intl = useIntl();
  const [openModal, closeModal] = useModal();

  const {
    data: privateKeySecret,
    isLoading: isPrivateKeySecretLoading,
  } = useQuery('privateKeySecret', getPrivateKeySecret, {});
  const { data: operator, isLoading: isOperatorLoading } = useQuery(
    'me',
    () => getMe().then(response => response.json()),
    {}
  );
  const [privateKey] = usePrivateKey(privateKeySecret);

  const openTableAllocation = selectedPrivateKey => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.tableAllocation.title',
      }),
      content: (
        <TableAllocationModal
          location={location}
          privateKey={selectedPrivateKey}
        />
      ),
    });
  };

  const openPrivateKeyLoader = onSuccess => {
    openModal({
      title: intl.formatMessage({
        id: 'privateKey.modal.title',
      }),
      content: (
        <PrivateKeyLoader
          onSuccess={onSuccess}
          publicKey={operator.publicKey}
          footerItem={
            <LinkButton
              type="link"
              onClick={closeModal}
              data-cy="skipPrivateKeyUpload"
            >
              {intl.formatMessage({ id: 'privateKey.modal.skip' })}
            </LinkButton>
          }
        />
      ),
      closable: true,
    });
  };

  const handleTableAllocation = () => {
    if (privateKey) {
      openTableAllocation(privateKey);
    } else {
      openPrivateKeyLoader(openTableAllocation);
    }
  };

  if (
    !location.tableCount ||
    location.tableCount === 0 ||
    isOperatorLoading ||
    isPrivateKeySecretLoading
  )
    return null;
  return (
    <TableAllocationWrapper onClick={handleTableAllocation}>
      {intl.formatMessage({ id: 'group.view.overview.tableAllocation' })}
    </TableAllocationWrapper>
  );
};
