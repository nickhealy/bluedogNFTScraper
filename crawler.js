const puppeteer = require('puppeteer');
require('dotenv').config()
const { uploadData } = require('./s3');

const toText = el => el.innerHTML;

const GHOST_MARKET_BASE = 'https://ghostmarket.io/'

const GHOST_URL = `${GHOST_MARKET_BASE}account/pha/P2K83Mn8suXudonzCgv5K3GgXkhToeQUgHZh2uArFpmav4a/?tab=onsale`
const CONNECTION_ATTEMPTS = 5

const ensurePage = async (page, url) => {
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    return true;
  } catch (e) {
    console.error(e)
    return false
  }
}

const getPageData = async (page, url) => {
  let hasData = false;
  let attempts = 0;
  while (attempts < CONNECTION_ATTEMPTS && !hasData) {
    hasData = await ensurePage(page, url)
    attempts++
    if (!hasData) {
       // Wait a few seconds, also a good idea to swap proxy here
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

const getContainingElement = async (page, selector, timeout = 4000) => {
  await page.waitForXPath(selector, {
    timeout
  });
  const result = await page.$x(selector)
  return result[0] // page.$x returns array, but this function is meant to return a single element
}

const getNftData = async () => {
  console.log("Beginning crawler...")
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox',]});

  const page = await browser.newPage();
  await getPageData(page, GHOST_URL);

  const nftDataContainer = await getContainingElement(page, '//*[@id="onsale-content"]/div/div/div[2]/div/div[1]')
  const nftCards = await nftDataContainer.$$('.asset-card')
  const parsedData = [];
  for (const card of nftCards) {
    const isOnSale = await card.$eval('.crypto', saleInfo => saleInfo.innerHTML !== ' not on sale')
    if (isOnSale) {
      const saleLink = await card.$eval('a', aTag => aTag.getAttribute('href'))
      const name = await card.$eval('.name.h-full.ellipsis', toText);
      const imgSrc = await card.$eval('#image-thumb-layer', img => img.getAttribute('src'))
      const priceCrypto = await card.$eval('.crypto', toText)
      const priceUSD = await card.$eval('.fiat.subtext', toText)

      const description = await getNftDescription(saleLink, browser)

      parsedData.push({
        saleLink, name, imgSrc, priceCrypto, priceUSD, description
      })
    }
  }
  uploadData({
    last_updated: Date.now(),
    data: parsedData
  })

  await browser.close();
};

const getNftDescription = async (href, browser) => {
  const finalUrl = `${GHOST_MARKET_BASE}${href}`
  const page = await browser.newPage()
  await getPageData(page, finalUrl)
  const description = await getContainingElement(page, '//*[@id="__layout"]/div/section/div/div[2]/div[1]/div/div[1]')
  const text = await description.$eval('.text.ellipsis', toText)
  return text.split('\n')[0] // we only want text from blockchain, which is the first element
}

getNftData()
  .then("Finished crawling!")
  .catch(console.error);

