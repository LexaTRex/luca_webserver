const CracoLessPlugin = require('craco-less');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');

const { THEME } = require('./ant.theme');

function generateVersionFile() {
  return {
    commit: process.env.GIT_COMMIT,
    version: process.env.GIT_VERSION,
  };
}

const licenseTypeOverrides = {
  // part of libphonenumber-js which is licensed under MIT
  'libphonenumber-js-core': 'MIT',
  'libphonenumber-js-min': 'MIT',
  'libphonenumber-js-max': 'MIT',
};

module.exports = {
  webpack: {
    plugins: {
      add: [
        new LicenseWebpackPlugin({
          perChunkOutput: false,
          outputFilename: 'licenses.json',
          stats: {
            warnings: false,
            errors: false,
          },
          licenseTypeOverrides,
          renderLicenses: modules => {
            const licenseList = [];
            modules.forEach(
              ({ packageJson: { name, version, licenses }, licenseId }) => {
                if (!licenseId && !licenses) {
                  console.error(`ERROR: Unknown license for package ${name}`);
                  // eslint-disable-next-line unicorn/no-process-exit
                  process.exit(1);
                }
                licenseList.push({
                  name,
                  version,
                  license: licenseId || licenses,
                });
              }
            );
            return JSON.stringify(licenseList);
          },
        }),
        new LicenseWebpackPlugin({
          perChunkOutput: false,
          outputFilename: 'licenses-full.txt',
          stats: {
            warnings: false,
            errors: false,
          },
          licenseTypeOverrides,
        }),

        new GenerateJsonPlugin('version.json', generateVersionFile()),
      ],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: THEME,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
