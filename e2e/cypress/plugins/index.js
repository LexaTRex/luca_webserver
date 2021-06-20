const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

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

module.exports = (on, config) => {
  on('task', {
    setCameraImage: async path => {
      await generateCameraStream(path);
      return true;
    },
  });
  on('before:browser:launch', async (browser = {}, launchOptions) => {
    launchOptions.args.push('--another-arg');

    if (browser.name === 'chrome') {
      launchOptions.args.push('--use-fake-ui-for-media-stream');
      launchOptions.args.push('--use-fake-device-for-media-stream');
      launchOptions.args.push(
        '--use-file-for-fake-video-capture=/tmp/luca/stream.mjpeg'
      );
    }

    return launchOptions;
  });
};
