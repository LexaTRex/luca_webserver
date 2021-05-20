const { Address4 } = require('ip-address');
const IPCIDR = require('ip-cidr');
const { Sequelize, Op } = require('sequelize');
const { isIP } = require('net');
const database = require('../database');

const CLASS_A_CIDR = new IPCIDR('10.0.0.0/8');
const CLASS_B_CIDR = new IPCIDR('172.16.0.0/12');
const CLASS_C_CIDR = new IPCIDR('192.168.0.0/16');
const CLASS_A_IPV6_CIDR = new IPCIDR('::ffff:10.0.0.0/8');
const CLASS_B_IPV6_CIDR = new IPCIDR('::ffff:172.16.0.0/12');
const CLASS_C_IPV6_CIDR = new IPCIDR('::ffff:192.168.0.0/16');

const isInternalIp = ipAddress => {
  return (
    CLASS_A_CIDR.contains(ipAddress) ||
    CLASS_B_CIDR.contains(ipAddress) ||
    CLASS_C_CIDR.contains(ipAddress) ||
    CLASS_A_IPV6_CIDR.contains(ipAddress) ||
    CLASS_B_IPV6_CIDR.contains(ipAddress) ||
    CLASS_C_IPV6_CIDR.contains(ipAddress)
  );
};

const isBlockedIp = async ipAddress => {
  const ipAddressAsBigInt = new Address4(ipAddress).bigInteger();
  const match = await database.IPAddressDenyList.findOne({
    where: {
      ipStart: {
        [Op.lte]: ipAddressAsBigInt,
      },
      ipEnd: {
        [Op.gte]: ipAddressAsBigInt,
      },
    },
  });

  return !!match;
};

const isAllowedIp = async ipAddress => {
  if (!isIP(ipAddress)) return false;
  const count = await database.IPAddressAllowList.count({
    where: Sequelize.literal(`ip >>= ${database.escape(ipAddress)}`),
  });
  return count !== 0;
};

const isRateLimitExemptIp = async ipAddress => {
  if (!isIP(ipAddress)) return false;
  const entries = await database.IPAddressAllowList.findAll({
    where: Sequelize.literal(`ip >>= ${database.escape(ipAddress)}`),
    attributes: ['rateLimitFactor'],
  });
  return entries.some(entry => entry.rateLimitFactor !== null);
};

module.exports = {
  isInternalIp,
  isBlockedIp,
  isAllowedIp,
  isRateLimitExemptIp,
};
