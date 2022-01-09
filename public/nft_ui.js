(function() {
    const BUCKET_URL = 'https://bluedog-nft-data.s3.us-west-1.amazonaws.com/nft_data.json'
    const GHOST_MARKET_BASE = 'https://ghostmarket.io/'

    const getGhostLink = href => GHOST_MARKET_BASE + href

    const isOnNftPage = window.location.href.includes('nft')
    
    const link = href => {
        const linkWrapper = document.createElement('a')
        linkWrapper.href = getGhostLink(href)
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

    const priceEl = (priceCrypto, priceUsd) => {
        const container = document.createElement('h6')
        container.innerHTML += `${priceUsd}&nbsp&nbsp<span>${priceCrypto}</span>`
        container.classList.add('price')
        return container
    }
    

    const nftDescription = text => {
        const description = document.createElement('p')
        description.innerText = text;
        return description
    }

    const button = href => {
        const container = document.createElement('button')
        container.addEventListener('click', (e) => {
            e.preventDefault()
            // button links to ghostmarket page, as well
            window.open(getGhostLink(href), '_blank').focus()
        })
        container.innerText = "SEE IT ON GHOSTMARKET"
        return container;
    }
    
    const card = ({ 
        sale_link, 
        name, 
        img_src, 
        price_crypto, 
        price_usd, 
        edition: editionText, 
        description: descriptionText}
        ) => {
        const linkEl = link(sale_link)
        const titleEl = title(name)
        const editionEl = edition(editionText)
        const imageEL = image(img_src, sale_link)
        const description = nftDescription(descriptionText)
        const price = priceEl(price_crypto, price_usd)
        const buttonEl = button(sale_link)

        const container = document.createElement('div')
        container.classList.add('card-container')
    
        container.appendChild(titleEl)
        container.appendChild(editionEl)
        container.appendChild(imageEL)
        container.appendChild(description)
        container.appendChild(price)
        container.appendChild(buttonEl)
        container.appendChild(linkEl)

        return container
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