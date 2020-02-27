'use strict';
const {Storage} = require('@google-cloud/storage');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');

//  get the current data / time and use it in the file names.
//  this wil be off as its ran on GCP
var date = new Date();
var dateString =
  ("00" + (date.getMonth() + 1)).slice(-2) + "." +
  ("00" + date.getDate()).slice(-2) + "." +
  date.getFullYear() + "_" +
  ("00" + date.getHours()).slice(-2) + ":" +
  ("00" + date.getMinutes()).slice(-2);
  

const openConnection = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1050 });
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

  const tempFolder = os.tmpdir();

  // get params from POST request
  const siteURL = req.body.siteURL;
  const name = req.body.name;

  let { browser, page } = await openConnection();

  try {
    await page.goto(`${siteURL}`+'/', { waitUntil: 'networkidle0', timeout: 30000 });

    let pathName = `${tempFolder}/${name}_${dateString}.png`;

    await page.screenshot({ path: pathName, fullPage: true });

    await uploadTempScreenShot(pathName);

    fs.unlinkSync(pathName);

    res.status(200).send({success: true, file: pathName, siteName: name, fileName: `${name}_${dateString}.png`});
  } catch (err) {
    res.status(500).send({success: false, msg: err.message});
  } finally {
    await closeConnection(page, browser);
  }
}; 
