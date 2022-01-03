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
        title.innerHTML = name
        return title;
    }
    
    const image = src => {
        const image = document.createElement('img')
        image.src = src
        return image
    }
    
    const cryptoPrice = amt => {
        const price = document.createElement('h5')
        price.innerHTML = amt
        return price
    }
    
    
    const usdPrice = amt => {
        const price = document.createElement('h5')
        price.innerHTML= amt
        return price
    }

    const nftDescription = text => {
        const description = document.createElement('p')
        description.innerText = text;
        return description
    }
    
    const card = ({ saleLink, name, imgSrc, priceCrypto, priceUSD, description: descriptionText}) => {
        const linkEl = link(saleLink)
        const titleEl = title(name)
        const imageEL = image(imgSrc, saleLink)
        const description = nftDescription(descriptionText)
        const cryptoPriceEl = cryptoPrice(priceCrypto)
        const usdPriceEl = usdPrice(priceUSD)

        const container = document.createElement('div')
        container.classList.add('card-container')
    
        container.appendChild(titleEl)
        container.appendChild(imageEL)
        container.appendChild(description)
        container.appendChild(cryptoPriceEl)
        container.appendChild(usdPriceEl)

        linkEl.appendChild(container)
        
        return linkEl
    }
        
    const createCards = (data) => {
        const wpElement = document.querySelector('#the_fullwidth_content')
        const container = document.createElement('div')
        container.classList.add('nft-container')
        for (const cardData of data) {
            container.appendChild(card(cardData))
        }
        for (const cardData of data) {
            container.appendChild(card(cardData))
        }

        wpElement.appendChild(container)
    }
        
    fetch(BUCKET_URL)
        .then(data => data.json())
        .then(data => createCards(data))
        .catch(console.error)
})()