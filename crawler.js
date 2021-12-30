const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path');
const { uploadData } = require('./s3');

const text = el => el.innerHTML;

const GHOST_URL = 'https://ghostmarket.io/account/pha/P2K83Mn8suXudonzCgv5K3GgXkhToeQUgHZh2uArFpmav4a/?tab=onsale'
const CONNECTION_ATTEMPTS = 5

const ensurePage = async page => {
  try {
    await page.goto(GHOST_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.asset-card', {
      timeout: 4000
    });
  } catch (e) {
    console.error(e)
    return false
  }
}

const getPageData = async page => {
  let hasData = false;
  let attempts = 0;
  while (attempts < CONNECTION_ATTEMPTS && hasData === false) {
    hasData = await ensurePage(page)
    attempts++
    if (hasData === false) {
       // Wait a few seconds, also a good idea to swap proxy here
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

const getNftData = async () => {
  console.log("Beginning crawler...")
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox',]});

  const page = await browser.newPage();
  await getPageData(page);

  const nftData = await page.$$('.asset-card')


  const parsedData = [];
  for (const card of nftData) {
    const isOnSale = await card.$eval('.crypto', saleInfo => saleInfo.innerHTML !== ' not on sale')
    if (isOnSale) {
      const saleLink = await card.$eval('a', aTag => aTag.getAttribute('href'))
      const name = await card.$eval('.name.h-full.ellipsis', text);
      const imgSrc = await card.$eval('#image-thumb-layer', img => img.getAttribute('src'))
      const priceCrypto = await card.$eval('.crypto', text)
      const priceUSD = await card.$eval('.fiat.subtext', text)

      parsedData.push({
        saleLink, name, imgSrc, priceCrypto, priceUSD
      })
    }
  }
  uploadData(parsedData)

  await browser.close();
};

getNftData()
  .then("Finished crawling!")
  .catch(console.error);

