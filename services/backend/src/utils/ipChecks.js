const { Address4 } = require('ip-address');
const IPCIDR = require('ip-cidr');
const { Op } = require('sequelize');
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

module.exports = { isInternalIp, isBlockedIp };
