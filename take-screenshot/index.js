'use strict';
const {Storage} = require('@google-cloud/storage');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');

const openConnection = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--incognito',
    ],
  });
  const page = await browser.newPage();

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  await page.setViewport({ width: dimensions.width, height: dimensions.height });
  return { browser, page };
};  

const closeConnection = async (page, browser) => {
  page && (await page.close());
  browser && (await browser.close());
};

const uploadTempScreenShot = async (tempFile) => {
  const storage = new Storage();
  const bucketName = 'temp-screenshot-storage';
  const filename = tempFile;

  await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  });
}

exports.takeScreenShot = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Locates the temp directory for temporary storage
  const tempFolder = os.tmpdir();

  // get params from POST request
  const siteURL = req.body.siteURL;
  const name = req.body.name;

  // Launch puppeteer
  let { browser, page } = await openConnection();

  try {
    // Navigate to URL requested
    await page.goto(`${siteURL}`+'/', { waitUntil: 'networkidle0' });

    // Path to temp folder
    let pathName = `${tempFolder}/${name}.png`;

    // Take the screenshot
    await page.screenshot({ path: pathName, fullPage: true, omitBackground: true });

    // upload it to storage
    await uploadTempScreenShot(pathName);

    // dump the temp folder - Clears up MEM for function to run efficently
    fs.unlinkSync(pathName);

    // send success
    res.status(200).send({success: true, file: pathName, siteName: name, fileName: `${name}.png`});
  } catch (err) {
    res.status(500).send({success: false, msg: err.message});
  } finally {
    // close puppeteer connection & browser
    await closeConnection(page, browser);
  }
}; 
