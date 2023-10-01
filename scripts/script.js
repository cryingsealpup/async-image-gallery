/// INITIAL SETUP + INFINITE SCROLL

const apiKey = 'BbUGpGYyYimP5Pg_udQcDe78Z9CJVb-dbTcyJTFB1f4'

let initialCount = 20,
    loaded = 0,
    total = 0,
    galleryItems = [],
    galleryWrapper = document.querySelector('.gallery'),
    ready = false,
    init = true,
    apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}`
    

function resetVariables() {
    initialCount = 20, loaded = 0, total = 0, galleryItems = [], ready = false, init = true
    galleryWrapper = document.querySelector('.gallery')
    while (galleryWrapper.firstChild) {
        galleryWrapper.removeChild(galleryWrapper.firstChild)
    }
}



function loadMore(count) { // Update API URL with new quantity of images
    apiURL = apiURL  + `&count=${count}`
}


function updateGlobals() { // Update counters and flags when images loaded
    loaded += 1
    if (loaded === total) {
        ready = true

    }

}

function fillGallery(galleryItems) {
    loaded = 0
    total = galleryItems.length
    galleryItems.forEach((item) => {
        const link = document.createElement('a'),
              img = document.createElement('img')
        link.setAttribute('href', item.links.html)
        link.setAttribute('target', '_blank')
        img.setAttribute('src', item.urls.regular)
        img.setAttribute('alt', item.alt_description)
        img.setAttribute('title', item.alt_description)
        img.addEventListener('load', updateGlobals)
        link.appendChild(img)

        
        galleryWrapper.appendChild(link)
        
    })
}

async function showGallery(apiURL) {
    if (init) {
        apiURL = apiURL + `&count=${initialCount}`
    }
    console.log(apiURL)
    const response = await (fetch(apiURL).catch()),
    galleryItems = await response.json()
    if (galleryItems.results) {
        fillGallery(galleryItems.results)
    }
    else {
        fillGallery(galleryItems)
    }
    

    if (init) {
        loadMore(40)
        init = false
    }
}

window.addEventListener('scroll', () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2000 &&
      ready
    ) {
      ready = false
      showGallery(apiURL)
    }
});

showGallery(apiURL)

/// SEARCH
const form = document.querySelector('.search')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchQuery = e.target.elements.searchTerm.value.trim()
    resetVariables()
    
    apiURL = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${apiKey}`
    showGallery(apiURL, true)
})