'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const os = require('os');
const path = require('path');
const fs = require('fs');

const puppeteer = require('puppeteer-core');
const { DateTime } = require('luxon');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.launch({
      browser: 'firefox',
      executablePath: '/usr/bin/firefox',
      args: [
        '--no-sandbox',
        '--lang=es-CL', // idioma del navegador
        '--accept-lang=es-CL,es;q=0.9', // header Accept-Language
      ],
    });
  }
  return browserInstance;
}

module.exports = {
  //@route('/pdf')
  //@method(['get'])
  pdf: async function (req, res) {
    //logger.info('inicia');
    let page = null;
    try {
      const browser = await getBrowser();

      page = await browser.newPage();

      await page.setViewport({
        width: 1240, // ~A4 landscape en px
        height: 1754, // ~A4 portrait en px
        deviceScaleFactor: 1,
      });

      // Aceptar automáticamente cualquier alert/confirm/prompt
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      page.on('requestfailed', (req) => {
        logger.error(`✗ FAILED: ${req.url()} — ${req.failure()?.errorText}`);
      });

      let url = `${process.env.HOST}/monitorear`;
      let fileName = `database_${DateTime.now().toFormat('yyyyLLdd_HHmmss')}.pdf`;

      const tmpFile = path.join(os.tmpdir(), fileName);

      await page.emulateTimezone(process.env.TIMEZONE);
      await page.goto(url, {
        waitUntil: 'domcontentloaded', //'networkidle0',
        timeout: 60000, // 60 segundos en vez del default de 30
      });

      // Espera que el loader aparezca (con catch por si no existe)
      await page
        .waitForSelector('#loader', { visible: true, timeout: 10000 })
        .then(() => logger.info('loader visible'))
        .catch(() => logger.info('loader no apareció, continuando...'));

      // Espera que el loader desaparezca (el AJAX terminó)
      await page.waitForSelector('#loader', { hidden: true, timeout: 60000 });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo extra para que cargue graficos bien!

      await page.pdf({
        path: tmpFile,
        format: 'Letter',
        landscape: true,
        printBackground: true,
      });

      await page.close();

      // Enviar el PDF y borrar el temporal después
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      const stream = fs.createReadStream(tmpFile);
      stream.pipe(res);
      stream.on('end', () => fs.unlink(tmpFile, () => {}));
      stream.on('error', () => fs.unlink(tmpFile, () => {}));
    } catch (error) {
      logger.error(error);
      if (page) await page.close().catch(() => {});
      response.APIError(req, res, error);
    }
  },
};
