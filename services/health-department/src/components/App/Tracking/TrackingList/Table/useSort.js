import { TIME_DESC, TIME_ASC, NAME_DESC, NAME_ASC } from 'constants/sorting';

const nameOf = (process, processNames) =>
  processNames.find(processName => {
    return (
      processName.processId === process.userTransferId ||
      processName.processId === process.uuid
    );
  })?.processName || '';

export const sort = (elements, sorting, processNames) => {
  const elementsToSort = elements.map(element => ({
    ...element,
    processName: nameOf(element, processNames),
  }));

  switch (sorting) {
    case TIME_DESC:
      return elementsToSort.sort((a, b) => b.createdAt - a.createdAt);
    case TIME_ASC:
      return elementsToSort.sort((a, b) => a.createdAt - b.createdAt);
    case NAME_DESC:
      return elementsToSort.sort((a, b) =>
        b.processName.localeCompare(a.processName)
      );
    case NAME_ASC:
      return elementsToSort.sort((a, b) =>
        a.processName.localeCompare(b.processName)
      );
    default:
      return elementsToSort;
  }
};
