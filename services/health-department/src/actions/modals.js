// Action Types
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

// Actions
export const openModal = ({
  title,
  content,
  closable = true,
  blueModal,
  wide = false,
}) => {
  return {
    type: OPEN_MODAL,
    payload: {
      title,
      content,
      closable,
      blueModal,
      wide,
    },
  };
};

export const closeModal = () => {
  return {
    type: CLOSE_MODAL,
  };
};
