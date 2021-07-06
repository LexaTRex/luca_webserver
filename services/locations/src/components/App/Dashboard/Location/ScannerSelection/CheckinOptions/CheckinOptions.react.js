import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';

import { ReactComponent as HandScannerSvg } from 'assets/handScanner.svg';
import { ReactComponent as CamScannerSvg } from 'assets/tablet.svg';
import { ReactComponent as ContactformSvg } from 'assets/contactform.svg';

import { HOSTNAME } from 'constants/routes';
import { useModal } from 'components/hooks/useModal';

import { CheckinQrModal } from 'components/App/modals/CheckinQrModal';
import {
  ServiceArea,
  Service,
  ServiceName,
  iconStyles,
  ServiceLink,
  LinkContent,
  ServiceWrapper,
} from './CheckinOptions.styled';

export const CheckinOptions = ({ location }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openContactForm = () => {
    window.open(`${HOSTNAME}/contact-form/${location.formId}`);
  };

  const openScanner = () => {
    window.open(`${HOSTNAME}/scanner/${location.scannerAccessId}`);
  };

  const openCamScanner = () => {
    window.open(`${HOSTNAME}/scanner/cam/${location.scannerAccessId}`);
  };

  const services = [
    {
      name: 'camScanner',
      url: `${HOSTNAME}/scanner/cam/${location.scannerAccessId}`,
      intl: 'modal.checkInOptions.camScanner',
      action: () => openCamScanner(),
      icon: <Icon style={iconStyles} component={CamScannerSvg} />,
    },
    {
      name: 'scanner',
      url: `${HOSTNAME}/scanner/${location.scannerAccessId}`,
      intl: 'modal.checkInOptions.scanner',
      action: () => openScanner(),
      icon: <Icon style={iconStyles} component={HandScannerSvg} />,
    },
    {
      name: 'contactForm',
      url: `${HOSTNAME}/contact-form/${location.formId}`,
      intl: 'modal.checkInOptions.contactForm',
      action: () => openContactForm(),
      icon: <Icon style={iconStyles} component={ContactformSvg} />,
    },
  ];

  const onCopy = link => {
    navigator.clipboard.writeText(link);
  };

  const openQrModal = service =>
    openModal({
      content: <CheckinQrModal service={service} />,
      title: intl.formatMessage({
        id: `modal.checkInQrModal.title_${service.name}`,
      }),
    });

  return (
    <ServiceArea>
      {services.map(service => (
        <ServiceWrapper
          key={service.name}
          style={service.style ? service.style : {}}
        >
          <Service
            onClick={service.action}
            key={service.intl}
            data-cy={service.name}
          >
            {service.icon}
            <ServiceName>
              {intl.formatMessage({
                id: service.intl,
              })}
            </ServiceName>
          </Service>
          <ServiceLink>
            <Tooltip
              title={intl.formatMessage({
                id: 'tooltip.copy',
              })}
              color="#b8cad3"
              trigger={['click']}
            >
              <LinkContent onClick={() => onCopy(service.url)}>
                {intl.formatMessage({
                  id: 'modal.checkInOptions.copyLink',
                })}
              </LinkContent>
            </Tooltip>
            <ServiceLink>
              <LinkContent onClick={() => openQrModal(service)}>
                {intl.formatMessage({
                  id: 'modal.checkInOptions.openViaQrCode',
                })}
              </LinkContent>
            </ServiceLink>
          </ServiceLink>
        </ServiceWrapper>
      ))}
    </ServiceArea>
  );
};
