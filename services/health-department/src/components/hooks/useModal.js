import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from 'actions/modals';

export const useModal = () => {
  const dispatch = useDispatch();

  const openModal = useCallback(
    payload => {
      dispatch(openModalAction(payload));
    },
    [dispatch]
  );

  const closeModal = useCallback(() => {
    dispatch(closeModalAction());
  }, [dispatch]);

  return [openModal, closeModal];
};
