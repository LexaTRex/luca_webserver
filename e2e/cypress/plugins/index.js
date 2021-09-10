const fs = require('fs');
const fse = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const postgres = require('cypress-postgres');

function generateCameraStream(path) {
  if (!fs.existsSync('/tmp/luca')) {
    fs.mkdirSync('/tmp/luca');
  }

  return new Promise((resolve, reject) =>
    ffmpeg(path)
      .videoCodec('libx264')
      .outputOptions(['-r', '1/5', '-pix_fmt', 'yuv420p'])
      .output('/tmp/luca/output.mp4')
      .loop(10)
      .on('error', reject)
      .on('end', () => {
        ffmpeg('/tmp/luca/output.mp4')
          .on('end', resolve)
          .on('error', reject)
          .output('/tmp/luca/stream.mjpeg')
          .run();
      })
      .run()
  );
}

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('..', 'e2e/config', `${file}.json`);
  console.log('Path to config:' + pathToConfigFile);
  console.log('Read config:' + pathToConfigFile);
  return fse.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
  require('cypress-fail-fast/plugin')(on, config);
  on('task', {
    setCameraImage: async path => {
      await generateCameraStream(path);
      return true;
    },
    deleteFileIfExists: path => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      return true;
    },
    fileExists: filename => {
      if (fs.existsSync(filename)) {
        return true;
      }
      return false;
    },
    dbQuery: query => postgres(query.query, query.connection),
  });

  on('before:browser:launch', async (browser = {}, launchOptions) => {
    launchOptions.args.push('--another-arg');
    if (browser.name === 'chrome') {
      launchOptions.args.push('--use-fake-ui-for-media-stream');
      launchOptions.args.push('--use-fake-device-for-media-stream');
      launchOptions.args.push(
        '--use-file-for-fake-video-capture=/tmp/luca/stream.mjpeg'
      );
      launchOptions.preferences.default['download'] = {
        default_directory: path.join(__dirname, 'downloads'),
      };
    }
    return launchOptions;
  });

  //switching between envs
  const file = config.env.configFile || 'local';
  return getConfigurationByFile(file);
};
