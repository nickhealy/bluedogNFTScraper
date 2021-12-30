(function() {
    const BUCKET_URL = 'https://bluedog-nft-data.s3.us-west-1.amazonaws.com/nft_data.json'
    const GHOST_MARKET_BASE = 'https://ghostmarket.io/'
    
    const link = href => {
        const linkWrapper = document.createElement('a')
        linkWrapper.href = `${GHOST_MARKET_BASE}${href}`
        return linkWrapper;
    }
    
    const title = name => {
        const title = document.createElement('h3')
        title.innerText = name
        return title;
    }
    
    const image = src => {
        const image = document.createElement('img')
        image.src = src
        return image
    }
    
    const cryptoPrice = amt => {
        const price = document.createElement('h5')
        price.innerText = amt
        return price
    }
    
    
    const usdPrice = amt => {
        const price = document.createElement('h5')
        price.innerText = amt
        return price
    }
    
    const card = ({ saleLink, name, imgSrc, priceCrypto, priceUSD}) => {
        const linkEl = link(saleLink)
        const titleEl = title(name)
        const imageEL = image(imgSrc)
        const cryptoPriceEl = cryptoPrice(priceCrypto)
        const usdPriceEl = usdPrice(priceUSD)
        
        linkEl.appendChild(titleEl)
        linkEl.appendChild(imageEL)
        linkEl.appendChild(imageEL)
        linkEl.appendChild(cryptoPriceEl)
        linkEl.appendChild(usdPriceEl)
        
        return linkEl
    }
        
    const createCards = (data) => {
        const container = document.querySelector('#the_fullwidth_content')
        for (const cardData of data) {
            container.appendChild(card(cardData))
        }
    }
        
    fetch(BUCKET_URL)
        .then(data => data.json())
        .then(data => createCards(data))
        .catch(console.error)
})()