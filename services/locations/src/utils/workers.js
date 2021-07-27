export const getPDFWorker = () =>
  new Worker('workers/createQRCodePDF.worker.js', {
    // https://github.com/GoogleChromeLabs/worker-plugin/issues/43#issuecomment-534439978
    name: 'pdfCreator',
    type: 'module',
  });
