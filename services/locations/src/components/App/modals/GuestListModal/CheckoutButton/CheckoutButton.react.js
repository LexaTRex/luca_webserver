import React from 'react';

import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const CheckoutButton = ({ trace, onCheckoutSingleGuest }) => {
  const intl = useIntl();

  if (trace.checkout) return null;

  return (
    <Popconfirm
      placement="topLeft"
      onConfirm={() => onCheckoutSingleGuest(trace.traceId)}
      title={intl.formatMessage({
        id: 'location.checkout.confirmText',
      })}
      okText={intl.formatMessage({
        id: 'location.checkout.confirmButton',
      })}
      cancelText={intl.formatMessage({
        id: 'location.checkout.declineButton',
      })}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
    >
      <PrimaryButton headline="true" data-cy="checkoutGuestSingle">
        {intl.formatMessage({
          id: 'group.view.overview.checkoutSingleGuest',
        })}
      </PrimaryButton>
    </Popconfirm>
  );
};
