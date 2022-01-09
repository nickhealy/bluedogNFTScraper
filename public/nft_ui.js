(function() {
    const BUCKET_URL = 'https://bluedog-nft-data.s3.us-west-1.amazonaws.com/nft_data.json'
    const GHOST_MARKET_BASE = 'https://ghostmarket.io/'

    const isOnNftPage = window.location.href.includes('nft')
    
    const link = href => {
        const linkWrapper = document.createElement('a')
        linkWrapper.href = `${GHOST_MARKET_BASE}${href}`
        return linkWrapper;
    }
    
    const title = name => {
        const title = document.createElement('h4')
        title.innerHTML = name
        return title;
    }

    const edition = editionInfo => {
        const text = document.createElement('h5')
        text.innerText = `Edition ${editionInfo}`
        text.classList.add('edition-info')
        return text
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
    
    const card = ({ saleLink, name, imgSrc, priceCrypto, priceUSD, edition: editionText, description: descriptionText}) => {
        const linkEl = link(saleLink)
        const titleEl = title(name)
        const editionEl = edition(editionText)
        const imageEL = image(imgSrc, saleLink)
        const description = nftDescription(descriptionText)
        const cryptoPriceEl = cryptoPrice(priceCrypto)
        const usdPriceEl = usdPrice(priceUSD)

        const container = document.createElement('div')
        container.classList.add('card-container')
    
        container.appendChild(titleEl)
        container.appendChild(editionEl)
        container.appendChild(imageEL)
        container.appendChild(description)
        container.appendChild(cryptoPriceEl)
        container.appendChild(usdPriceEl)

        linkEl.appendChild(container)
        
        return linkEl
    }

    const lastUpdated = (timestamp) => {
        const lastUpdatedDate = new Date(timestamp);
        const textEl = document.createElement('p')
        textEl.innerText = `Last updated ${lastUpdatedDate.toLocaleString()}`;
        textEl.classList.add('last-updated')
        return textEl;
    }

    const createWidget = data => {
        const { data: nftData, last_updated: lastUpdatedTimestamp} = data;
        const widgetContainer = document.createElement('div')
        widgetContainer.appendChild(lastUpdated(lastUpdatedTimestamp))
        widgetContainer.appendChild(createCards(nftData))

        const wpElement = document.querySelector('#the_fullwidth_content')
        wpElement.appendChild(widgetContainer)
    }
        
    const createCards = (nftData) => {
        const container = document.createElement('div')
        container.classList.add('nft-container')
        for (const cardData of nftData) {
            container.appendChild(card(cardData))
        }
        return container

    }

    if (isOnNftPage) {
        fetch(BUCKET_URL)
            .then(data => data.json())
            .then(data => createWidget(data))
            .catch(console.error)
    }
})()