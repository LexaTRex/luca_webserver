import { TIME_DOWN } from 'constants/sorting';

export const sort = (elementsToSort, sorting) => {
  switch (sorting) {
    case TIME_DOWN:
      return elementsToSort.sort((a, b) => b.createdAt - a.createdAt);
    default:
      return elementsToSort;
  }
};
