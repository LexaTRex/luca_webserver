import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Checkbox, Button } from 'antd';

import {
  backButtonStyles,
  nextButtonStyles,
  CardTitle,
  CardSubTitle,
  ButtonWrapper,
  Step,
  Description,
} from 'components/Authentication/Authentication.styled';
import { TERMS_CONDITIONS_LINK } from 'constants/links';
import AVV from 'assets/documents/AVV_Luca.pdf';

export const LegalTermsStep = ({ next, back, navigation }) => {
  const intl = useIntl();

  const onFinish = () => {
    next();
  };

  return (
    <>
      <Step>{navigation}</Step>
      <CardTitle data-cy="legalTerms">
        {intl.formatMessage({
          id: 'authentication.legalTerms.title',
        })}
      </CardTitle>
      <CardSubTitle>
        {intl.formatMessage({
          id: 'authentication.legalTerms.subTitle',
        })}
      </CardSubTitle>
      <Form onFinish={onFinish}>
        <Form.Item
          name="termsAndConditions"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      intl.formatMessage({
                        id: 'error.termsAndConditions',
                      })
                    ),
            },
          ]}
        >
          <Checkbox>
            {intl.formatMessage(
              { id: 'authentication.registration.acceptTerms' },
              {
                // eslint-disable-next-line react/display-name
                a: (...chunks) => (
                  <a
                    href={TERMS_CONDITIONS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              }
            )}
          </Checkbox>
        </Form.Item>

        <Form.Item
          name="avv"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      intl.formatMessage({
                        id: 'error.avv',
                      })
                    ),
            },
          ]}
        >
          <Checkbox>
            {intl.formatMessage(
              { id: 'authentication.registration.acceptAvv' },
              {
                // eslint-disable-next-line react/display-name
                a: (...chunks) => (
                  <a
                    href={AVV}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              }
            )}
          </Checkbox>
        </Form.Item>
        <Description>
          {intl.formatMessage({ id: 'authentication.registration.legalHint' })}
        </Description>
        <ButtonWrapper multipleButtons>
          <Button style={backButtonStyles} onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </>
  );
};
