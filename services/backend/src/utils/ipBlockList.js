const config = require('config');
const axios = require('axios');
const moment = require('moment');
const { Op } = require('sequelize');
const IPCIDR = require('ip-cidr');
const parse = require('csv-parse/lib/sync');
const database = require('../database');
const logger = require('./logger').default;

const getIpRange = input => {
  const ip = new IPCIDR(input.match('/') ? input : `${input}/32`);
  return {
    startIp: ip.start(),
    endIp: ip.end(),
  };
};

const getIpsFromNetsetFile = content => {
  return content
    .split('\n')
    .filter(line => !line.startsWith('#'))
    .filter(line => IPCIDR.isValidAddress(line))
    .map(line => getIpRange(line));
};

const getIpsfromCSVFile = (content, index = 0) => {
  const records = parse(content, { skip_empty_lines: true });
  return records
    .map(record => record[Number.parseInt(index, 10)])
    .filter(ip => IPCIDR.isValidAddress(ip))
    .map(line => getIpRange(line));
};

const getIpRangefromCSVFile = (content, first = 0, second = 1) => {
  const records = parse(content, { skip_empty_lines: true });
  return records
    .map(record => [
      record[Number.parseInt(first, 10)],
      record[Number.parseInt(second, 10)],
    ])
    .filter(
      ([startIp, endIp]) =>
        IPCIDR.isValidAddress(startIp) && IPCIDR.isValidAddress(endIp)
    )
    .map(([startIp, endIp]) => ({
      startIp,
      endIp,
    }));
};

const getIpList = async () => {
  const netsetUrls = config.get('blockListSources.netset').split(',');
  const netsetIps =
    netsetUrls.length > 0
      ? (
          await Promise.all(
            netsetUrls.map(url =>
              axios.get(url, { timeout: 2000 }).catch(() => true)
            )
          )
        )
          .map(({ data }) => data)
          .flatMap(list => getIpsFromNetsetFile(list))
      : [];

  const csvSingleUrls = config.get('blockListSources.singleCSV').split(',');
  const csvSingleIps =
    csvSingleUrls.length > 0
      ? await Promise.all(
          csvSingleUrls.map(url =>
            axios.get(url, { timeout: 2000 }).catch(() => true)
          )
        ).then(responses =>
          responses.flatMap(({ data }) => getIpsfromCSVFile(data))
        )
      : [];

  const csvDoubleUrls = config.get('blockListSources.doubleCSV').split(',');
  const csvDoubleIps =
    csvDoubleUrls.length > 0
      ? await Promise.all(
          csvDoubleUrls.map(url =>
            axios.get(url, { timeout: 2000 }).catch(() => true)
          )
        ).then(responses =>
          responses.flatMap(({ data }) => getIpRangefromCSVFile(data, 2, 3))
        )
      : [];

  return [...netsetIps, ...csvSingleIps, ...csvDoubleIps];
};

const updateBlockList = async () => {
  const now = moment();
  let ips;
  try {
    ips = await getIpList();
  } catch (error) {
    logger.error(error, 'failed to update blockList');
    return;
  }

  const ipsWithTimestamp = ips.map(ip => ({ ...ip, createdAt: now }));

  try {
    await database.transaction(async transaction => {
      await database.IPAddressBlockList.bulkCreate(ipsWithTimestamp, {
        returning: false,
        transaction,
      });
      await database.IPAddressBlockList.destroy({
        where: {
          createdAt: { [Op.lt]: now },
        },
        transaction,
      });
    });
  } catch (error) {
    logger.warn(error);
  }

  logger.info(`IPAddressBlockList updated. Entries count: ${ips.length}`);
  logger.info('BlockList updated');
};

module.exports = {
  updateBlockList,
};
