import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { Modal } from 'antd';
import { useQuery } from 'react-query';
import { getVersion } from 'network/static';
import {
  LinkVersion,
  LinkWrapper,
  Description,
  Version,
} from './VersionLink.styled';

export const VersionLink = () => {
  const intl = useIntl();
  const { isSuccess: loaded, data: info } = useQuery('version', getVersion, {
    refetchOnWindowFocus: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <LinkWrapper>
        <LinkVersion onClick={showModal}>
          {intl.formatMessage({ id: 'license.version' })}
        </LinkVersion>
      </LinkWrapper>
      <Modal
        title={intl.formatMessage({ id: 'license.version' })}
        visible={isModalVisible}
        width={600}
        footer={null}
        onOk={closeModal}
        onCancel={closeModal}
        closable
      >
        <Description>
          <Version>
            {loaded && (
              <>
                <span>
                  {intl.formatMessage({ id: 'commitHashVersionDisplay' })}
                </span>
                <br />
                <span>{`(${info.version}#${info.commit})`}</span>
              </>
            )}
          </Version>
        </Description>
      </Modal>
    </>
  );
};
