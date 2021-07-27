const CracoLessPlugin = require('craco-less');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');

const { THEME } = require('./ant.theme');

const generateVersionFile = () => ({
  commit: process.env.GIT_COMMIT,
  version: process.env.GIT_VERSION,
});

const licenseTypeOverrides = {
  // part of libphonenumber-js which is licensed under MIT
  'libphonenumber-js-core': 'MIT',
  'libphonenumber-js-min': 'MIT',
  'libphonenumber-js-max': 'MIT',
};

module.exports = {
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
    configure: config => {
      config.module.rules.push({
        test: /\.wasm$/,
        loader: 'base64-loader',
        type: 'javascript/auto',
      });

      // eslint-disable-next-line no-param-reassign
      config.module.noParse = /\.wasm$/;
      config.module.rules.forEach(rule => {
        (rule.oneOf || []).forEach(oneOf => {
          if (oneOf.loader && oneOf.loader.includes('file-loader')) {
            oneOf.exclude.push(/\.wasm$/);
          }
        });
      });
      return config;
    },
  },
};
