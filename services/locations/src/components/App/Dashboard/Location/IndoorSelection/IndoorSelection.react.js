import React from 'react';
import { notification, Tooltip } from 'antd';
import { useIntl } from 'react-intl';
import { IndoorToggle } from 'components/App/Dashboard/IndoorToggle';
import { updateLocation } from 'network/api';
import {
  CardSection,
  CardSectionDescription,
  CardSectionTitle,
  LocationCard,
} from '../LocationCard';
import {
  informationTooltipStyle,
  StyledFooter,
  StyledInformationText,
} from './IndoorSelection.styled';

export const IndoorSelection = ({ location }) => {
  const intl = useIntl();

  const onChangeValue = newValue => {
    updateLocation({
      locationId: location.uuid,
      data: {
        isIndoor: newValue,
      },
    })
      .then(() => {
        notification.success({
          message: intl.formatMessage({
            id: 'notification.updateLocation.success',
          }),
          className: 'editLocationSuccess',
        });
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.updateLocation.error',
          }),
        });
      });
  };

  return (
    <LocationCard
      isCollapse
      title={intl.formatMessage({
        id: 'settings.location.indoorToggle.headline',
      })}
    >
      <CardSection isLast>
        <CardSectionTitle>
          <div>
            {intl.formatMessage({
              id: 'settings.location.indoorToggle.description.label',
            })}
          </div>
          <div>
            <Tooltip
              style={informationTooltipStyle}
              placement="topLeft"
              title={intl.formatMessage({
                id: 'settings.location.indoorToggle.tooltip',
              })}
              overlay={intl.formatMessage({
                id: 'settings.location.indoorToggle.information',
              })}
            >
              <StyledInformationText>
                {intl.formatMessage({
                  id: 'settings.location.indoorToggle.tooltip',
                })}
              </StyledInformationText>
            </Tooltip>
          </div>
        </CardSectionTitle>
        <CardSectionDescription>
          {intl.formatMessage({
            id: 'settings.location.indoorToggle.description',
          })}
        </CardSectionDescription>
        <StyledFooter>
          <IndoorToggle value={location.isIndoor} callback={onChangeValue} />
        </StyledFooter>
      </CardSection>
    </LocationCard>
  );
};
