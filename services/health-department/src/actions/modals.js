// Action Types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

// Actions
export const openModal = ({
  title,
  content,
  closable = true,
  wide = false,
}) => {
  return {
    type: OPEN_MODAL,
    payload: {
      title,
      content,
      closable,
      wide,
    },
  };
};

export const closeModal = () => {
  return {
    type: CLOSE_MODAL,
  };
};
