const { expect } = require('chai');
const moment = require('moment');
const { getBinaryHeaderBuffer } = require('./notificationsV4');

const NO_HASH_INPUT_HASH_BUFFER = Buffer.alloc(16);

describe('notifications', () => {
  describe('build header', () => {
    it('can build a header without a hash', async () => {
      const chunkHeader = getBinaryHeaderBuffer(undefined);
      expect(chunkHeader.length).to.equal(32);

      const schemaVersion = chunkHeader.slice(0, 1).readInt8(0);
      const algorithmType = chunkHeader.slice(1, 2).readInt8(0);
      const hashLength = chunkHeader.slice(2, 3).readInt8(0);
      const createdAt = chunkHeader.slice(3, 11).readBigInt64BE(0);
      const lastSliceHash = chunkHeader.slice(16, 32);

      expect(schemaVersion).to.equal(1);
      expect(algorithmType).to.equal(0);
      expect(hashLength).to.equal(12);
      expect(Number(createdAt)).to.be.lessThan(moment().valueOf());
      expect(lastSliceHash).to.deep.equal(NO_HASH_INPUT_HASH_BUFFER);
    });
  });
});
