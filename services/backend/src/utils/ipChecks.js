const IPCIDR = require('ip-cidr');
const { Sequelize, Op } = require('sequelize');
const { isIP, isIPv4 } = require('net');
const database = require('../database');

const CLASS_A_CIDR = new IPCIDR('10.0.0.0/8');
const CLASS_B_CIDR = new IPCIDR('172.16.0.0/12');
const CLASS_C_CIDR = new IPCIDR('192.168.0.0/16');
const CLASS_A_IPV6_CIDR = new IPCIDR('::ffff:10.0.0.0/104');
const CLASS_B_IPV6_CIDR = new IPCIDR('::ffff:172.16.0.0/108');
const CLASS_C_IPV6_CIDR = new IPCIDR('::ffff:192.168.0.0/112');

const isInternalIp = ipAddress => {
  if (!isIP(ipAddress)) return false;
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
  if (!isIPv4(ipAddress)) return true;
  const ip = await database.IPAddressBlockList.findOne({
    where: {
      startIp: {
        [Op.lte]: ipAddress,
      },
      endIp: {
        [Op.gte]: ipAddress,
      },
    },
  });
  return ip !== null;
};

const isAllowedIp = async ipAddress => {
  if (!isIPv4(ipAddress)) return false;
  if (isInternalIp(ipAddress)) return true;
  const ip = await database.IPAddressAllowList.findOne({
    where: Sequelize.literal(`ip >>= ${database.escape(ipAddress)}`),
  });
  return ip !== null;
};

const isRateLimitExemptIp = async ipAddress => {
  if (!isIPv4(ipAddress)) return false;
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
