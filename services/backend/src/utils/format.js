const formatLocationName = (location, group) => {
  if (!group) {
    return location.name;
  }
  return location.name ? `${group.name} - ${location.name}` : `${group.name}`;
};

module.exports = { formatLocationName };
