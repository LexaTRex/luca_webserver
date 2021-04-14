import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';

import { ReactComponent as HandScannerSvg } from 'assets/handScanner.svg';
import { ReactComponent as CamScannerSvg } from 'assets/tablet.svg';
import { ReactComponent as ContactformSvg } from 'assets/contactform.svg';

import { HOSTNAME } from 'constants/routes';

import {
  Description,
  ServiceArea,
  Service,
  Info,
  ServiceName,
  iconStyles,
  CopyLink,
  Copy,
  ServiceWrapper,
} from './CheckInOptions.styled';

export const CheckInOptions = ({ location }) => {
  const intl = useIntl();

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
      name: 'scanner',
      url: `${HOSTNAME}/scanner/${location.scannerAccessId}`,
      intl: 'modal.checkInOptions.scanner',
      action: () => openScanner(),
      icon: <Icon style={iconStyles} component={HandScannerSvg} />,
    },
    {
      name: 'camScanner',
      url: `${HOSTNAME}/scanner/cam/${location.scannerAccessId}`,
      intl: 'modal.checkInOptions.camScanner',
      action: () => openCamScanner(),
      icon: <Icon style={iconStyles} component={CamScannerSvg} />,
      style: { margin: '0 48px' },
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

  return (
    <>
      <Description>
        {intl.formatMessage({
          id: 'modal.checkInOptions.description',
        })}
        <Tooltip
          title={intl.formatMessage({
            id: 'modal.checkInOptions.info.tooltip',
          })}
          color="#b8cad3"
          trigger={['hover']}
        >
          <Info>
            {intl.formatMessage({
              id: 'general.information',
            })}
          </Info>
        </Tooltip>
      </Description>
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
            <CopyLink>
              <Tooltip
                title={intl.formatMessage({
                  id: 'tooltip.copy',
                })}
                color="#b8cad3"
                trigger={['click']}
              >
                <Copy onClick={() => onCopy(service.url)}>
                  {intl.formatMessage({
                    id: 'modal.checkInOptions.copyLink',
                  })}
                </Copy>
              </Tooltip>
            </CopyLink>
          </ServiceWrapper>
        ))}
      </ServiceArea>
    </>
  );
};
