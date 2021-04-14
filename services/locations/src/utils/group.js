export const getBaseLocationFromGroup = group => {
  return group.locations.find(location => !location.name);
};
