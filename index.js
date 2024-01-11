
let ContentReaderFromURL = {

    // Variables //
    BaseURL: 'https://www.adelphi.edu/wp-json/wp',
    URI: '/v2/event?page=',
    firstVisit: null,
    i: 1,

    // Elements //
    nextBtn: document.getElementById('next-btn'),
    prevBtn: document.getElementById('prev-btn'),
    list: document.querySelector('.list-view'),
    page: document.querySelector('.page-count'),
    page2: document.querySelector('.page-count-2'),
    scrollToTopBtn: document.getElementById("scrollToTopBtn"),

    // Reusable methods //
    // Loading animation functions upon page load to hide the API text from popping in after page loads
    loadingFade: () => {
        const loadingBg = document.querySelector('.loading__bg');
        const loadingImg = document.querySelector('.loading__img');
        loadingBg.style.opacity = "0";
        loadingImg.style.opacity = "0";
    },

    loadingRemove: () => {
        const loading = document.querySelector('.loading');
        loading.style.display = "none";
    },

    // Retrieves API data and alters text of unordered list in index.html to include results
    getData: (BaseURL, URI, i) => {
        console.log(`${BaseURL}${URI}${i}`)
        document.querySelector('.list-view').innerHTML = "";
        axios.get(`${BaseURL}${URI}${i}`).then(response => {
            console.log(`GET adelphi data`, response);
            const {data} = response;

            ContentReaderFromURL.page.innerHTML = `<p>Page ${i} of 115</p>`;
            ContentReaderFromURL.page2.innerHTML = `<p>Page ${i} of 115</p>`;
    
    
            data.forEach((entry) => {
                const listContentBlock = document.createElement('article');
                // console.log(entry)
                listContentBlock.classList.add('list-content');
    
                // Inner Content of each block
                const title = document.createElement('h2');
                title.classList.add('content-title');
                title.onclick = () => {
                    window.open(entry.link, "_blank");
                }
                const listContent = document.createElement('div');
                listContent.classList.add('list-content-html');
    
                const date = document.createElement('p');
                let dateObject = new Date(entry.start).toISOString().split('T')[0];
                date.innerText = dateObject;
    
                let contentIndex = entry.content.indexOf('</p>');
                listContent.innerHTML = entry.content == "" ? "<p>No description found.</p>" : entry.content.slice(0,contentIndex) + '....';
                title.innerText = entry.title;
    
                listContentBlock.append(title);
                listContentBlock.append(listContent);
                listContentBlock.append(date);
                ContentReaderFromURL.list.append(listContentBlock);
            });   
        })
        .catch((error) => console.log(error));
    },

    nextPage: () => {
        ContentReaderFromURL.i += 1;
        if(ContentReaderFromURL.i == 116) ContentReaderFromURL.i = 1;
        window.scrollTo(0, 0);
        ContentReaderFromURL.getData(ContentReaderFromURL.BaseURL,ContentReaderFromURL.URI,ContentReaderFromURL.i);
    },
    
    prevPage: () => {
        ContentReaderFromURL.i -= 1;
        if(ContentReaderFromURL.i == 0) ContentReaderFromURL.i = 115;
        window.scrollTo(0, 0);
        ContentReaderFromURL.getData(ContentReaderFromURL.BaseURL,ContentReaderFromURL.URI,ContentReaderFromURL.i);
    },

    scrollFunction: () => {
        if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 20) {
            ContentReaderFromURL.scrollToTopBtn.style.display = "block";
          } else {
            ContentReaderFromURL.scrollToTopBtn.style.display = "none";
          }
    },

    topFunction: () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },

    // Starts all required functions to fetch info
    setup: () => {

        ContentReaderFromURL.getData(ContentReaderFromURL.BaseURL,ContentReaderFromURL.URI,ContentReaderFromURL.i);

        if (ContentReaderFromURL.firstVisit == null) {
            window.setInterval(ContentReaderFromURL.loadingFade, 1500);
            window.setInterval(ContentReaderFromURL.loadingRemove, 3000);
        } else {
            ContentReaderFromURL.loadingRemove;
        }

        window.onscroll = function() {ContentReaderFromURL.scrollFunction()}
        
        ContentReaderFromURL.PushState();
        ContentReaderFromURL.PopState();

        document.onkeydown = (e) => {
            console.log(e.key)
            switch (e.key) {
                case 'ArrowRight':
                    ContentReaderFromURL.nextPage()
                    ContentReaderFromURL.PushState()
                    break;
                case 'ArrowLeft':
                    ContentReaderFromURL.prevPage()
                    ContentReaderFromURL.PushState()
                    break;
            }
        }

        ContentReaderFromURL.nextBtn.onclick = () => {
            ContentReaderFromURL.nextPage();
            ContentReaderFromURL.PushState();
        }
        ContentReaderFromURL.prevBtn.onclick = () => {
            ContentReaderFromURL.prevPage();
            ContentReaderFromURL.PushState();
        }
    },

    // State Management for URL
    PushState: () => {
        history.pushState(ContentReaderFromURL.i, `Page ${ContentReaderFromURL.i}`, `./page=${ContentReaderFromURL.i}` )
    },

    PopState: () => {
        window.addEventListener('popstate', e => {
            console.log(e.state)
            if (e.state !== null) {
                ContentReaderFromURL.i = e.state;
                ContentReaderFromURL.setup();
            }
            else {
                ContentReaderFromURL.i = 1;
                ContentReaderFromURL.setup();
            }
        })
    }
}

ContentReaderFromURL.setup();

