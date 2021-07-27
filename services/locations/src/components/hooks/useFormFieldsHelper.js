import {
  useCityValidator,
  useHouseNoValidator,
  useStreetValidator,
  useZipCodeValidator,
} from 'components/hooks/useValidators';

export const useFormFields = () => {
  const streetValidator = useStreetValidator('streetName');
  const houseNoValidator = useHouseNoValidator('streetNr');
  const zipCodValidator = useZipCodeValidator('zipCode');
  const cityValidator = useCityValidator('city');

  return [
    { fieldName: 'streetName', validator: streetValidator },
    { fieldName: 'streetNr', validator: houseNoValidator },
    { fieldName: 'zipCode', validator: zipCodValidator },
    { fieldName: 'city', validator: cityValidator },
  ];
};
