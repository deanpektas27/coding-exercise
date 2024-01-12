class ContentReaderFromURL {

    // Variables
    BaseURL             = 'https://www.adelphi.edu/wp-json/wp';
    URI                 = '/v2/event?page=';
    i                   = 1;
    TotalPages          = 0;

    FetchData           = false;
    TypingTimer         = null;

    // Elements
    NextBtn             = document.getElementById('next-btn');
    PrevBtn             = document.getElementById('prev-btn');
    List                = document.querySelector('.list-view');
    Page                = document.querySelector('.page-count');
    Page2               = document.querySelector('.page-count-2');
    ScrollToTopBtn      = document.getElementById("scrollToTopBtn");

    
    // methods

    // State Management for URL
    PushState = () => {
        history.pushState(this.i, `Page ${this.i}`, `./page=${this.i}` )
    };

    PopState = () => {
        window.addEventListener('popstate', e => {
            console.log(e.state)
            if (e.state !== null) {
                this.i = e.state;
                this.getData();
            }
            else {
                this.i = 1;
                this.getData();
            }
        })
    }

    // Retrieves API data and alters text of unordered list in index.html to include results
    getData = () => {
        console.log(`${this.BaseURL}${this.URI}${this.i}`)
        document.querySelector('.list-view').innerHTML = "";
        axios.get(`${this.BaseURL}${this.URI}${this.i}`).then(response => {
            console.log(`GET adelphi data`, response);

            // Set values based on API request
            this.TotalPages = Number(response.headers[`x-wp-totalpages`])
            this.Page.innerHTML = `Page <input class="page-input" value='${this.i}' /> of ${this.TotalPages}`;
            this.Page2.innerHTML = `Page ${this.i} of ${this.TotalPages}`;
    
            // Display each object in response
            const {data} = response;
            data.forEach((entry) => {
                const listContentBlock = document.createElement('article');
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
                this.List.append(listContentBlock);
                document.querySelector('.content').classList.remove('loading');
                document.querySelector('.content').classList.add('loaded');
            });
    
            // Input a custom API request with desired number
            const PageInput = document.querySelector('.page-input');
            // console.log('pageinput yay', PageInput)
            PageInput.addEventListener('keyup', this.debounce( (e) => {
                let DesiredPage = Number(e.srcElement.value)
                console.log(DesiredPage);
                if (DesiredPage <= this.TotalPages && DesiredPage > 0) {
                    this.i = DesiredPage;
                    window.scrollTo(0, 0);
                    this.paginationLoader();
                    this.PushState();
                    this.getData(this.BaseURL,this.URI,this.i);
                } else {
                    alert('Invalid Request!');
                    PageInput.value = this.i;
                    console.log(PageInput.value);
                }
            }, 800))
        })
        .catch((error) => console.log(error));                
        
    };

    paginationLoader() {
        document.querySelector('.content').classList.remove('loaded');
        document.querySelector('.content').classList.add('loading');
    };

    nextPage = () => {
        this.i += 1;
        if(this.i > this.TotalPages) this.i = 1;
        window.scrollTo(0, 0);
        this.paginationLoader();
        this.PushState();
        this.getData(this.BaseURL,this.URI,this.i);
    };
    
    prevPage = () => {
        this.i -= 1;
        if(this.i < 1) this.i = this.TotalPages;
        window.scrollTo(0, 0);
        this.paginationLoader();
        this.PushState();
        this.getData(this.BaseURL,this.URI,this.i);
    };

    // Loading animation functions upon page load to hide the API text from popping in after page loads
    loadingFade = () => {
        const loadingBg = document.querySelector('.loading__bg');
        const loadingImg = document.querySelector('.loading__img');
        loadingBg.style.opacity = "0";
        loadingImg.style.opacity = "0";
    };

    loadingRemove = () => {
        const loading = document.querySelector('.loading_container');
        loading.style.display = "none";
    };

    scrollFunction = () => {
        if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 20) {
            this.ScrollToTopBtn.style.display = "block";
          } else {
            this.ScrollToTopBtn.style.display = "none";
          }
    };

    topFunction = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    // Starts all required functions to fetch info
    setup = () => {
        this.getData();

        if (this.firstVisit == null) {
            window.setInterval(this.loadingFade, 1500);
            window.setInterval(this.loadingRemove, 3000);
        } else {
            this.loadingRemove;
        }

        window.onscroll = () => {
            this.scrollFunction();
        }

        window.addEventListener('keyup', this.debounce( (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    this.nextPage();
                    break;
                case 'ArrowLeft':
                    this.prevPage()
                    break;
            }
        }, 800))

        this.NextBtn.onclick = this.debounce(() => {
            this.nextPage();
        }, 800);
        this.PrevBtn.onclick = this.debounce(() => {
            this.prevPage();
        }, 800);

    };

    debounce = (callback, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => { callback.apply(this, args); }, wait);
        };
    }
}

const render = new ContentReaderFromURL()
render.setup();
render.PopState();

