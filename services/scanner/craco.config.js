const CracoLessPlugin = require('craco-less');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { THEME } = require('./ant.theme');

function generateVersionFile() {
  return {
    commit: process.env.GIT_COMMIT,
    version: process.env.GIT_VERSION,
  };
}

module.exports = {
  webpack: {
    plugins: {
      add: [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg|json|ico|eot|otf|ttf)$/,
          deleteOriginalAssets: false,
        }),
        new LicenseWebpackPlugin({
          perChunkOutput: false,
          outputFilename: 'licenses.json',
          stats: {
            warnings: false,
            errors: false,
          },
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
