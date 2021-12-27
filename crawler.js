const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path')

const text = el => el.innerHTML;

const saveNftData = data => {
  const filePath = path.join(__dirname, 'nft_data.json')
  fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8'});
}

const getNftData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ghostmarket.io/account/pha/P2K83Mn8suXudonzCgv5K3GgXkhToeQUgHZh2uArFpmav4a/?tab=onsale', {
    waitUntil: 'networkidle0'
  });

  await page.waitForSelector('.asset-card', {
    timeout: 4000
  });

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
  saveNftData(parsedData)

  await browser.close();
};

getNftData()

module.exports = {
  getNftData
}


