import assert from 'assert';

export function assertStringOrNumericValues(object) {
  Object.values(object).forEach(value => {
    assert(typeof value === 'string' || typeof value === 'number');
  });
}

export function escapeProblematicCharacters(object) {
  const target = {};
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'string') {
      target[key] = value.replace(/^([=+-@\t\r])/, "'$1");
    } else {
      target[key] = value;
    }
  });
  return target;
}
