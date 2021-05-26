import assert from 'assert';

export function assertStringOrNumericValues(object) {
  Object.values(object).forEach(value => {
    assert(typeof value === 'string' || typeof value === 'number');
  });
}
