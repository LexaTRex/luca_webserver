export const sortLocations = locations => {
  // Base location should be first
  // Other locations after base sorted alphabetically
  const baseLocation = locations.find(location => !location.name);
  const rest = locations.filter(location => location.name);
  const sortedRest = rest.sort((a, b) => a.name.localeCompare(b.name));

  return [baseLocation, ...sortedRest];
};
