class ContentReaderFromURL {

    // Variables
    BaseURL             = 'https://www.adelphi.edu/wp-json/wp';
    URI                 = '/v2/event?page=';
    i                   = 1;
    TotalPages          = 0;

    // Elements
    NextBtn             = document.getElementById('next-btn');
    PrevBtn             = document.getElementById('prev-btn');
    List                = document.querySelector('.list-view');
    Page                = document.querySelector('.page-count');
    Page2               = document.querySelector('.page-count-2');
    ScrollToTopBtn      = document.getElementById("scrollToTopBtn");
    
    // Methods

    // State Management for URL, takes current i value and places it next to a hashtag in the URL
    PushState = () => {
        window.location.hash = this.i;
    };

    // Retrieves API data and alters text of unordered list in index.html to include results
    getData = () => {
        this.paginationLoader();
        // Clear current list before fetching data from API
        document.querySelector('.list-view').innerHTML = "";
        axios.get(`${this.BaseURL}${this.URI}${this.i}`).then(response => {

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
    
            // Attach event listener every time page input is created at the beginning of API request, 
            // allows user to input a desired number for a custom API request
            const PageInput = document.querySelector('.page-input');
            PageInput.addEventListener('keyup', this.debounce( (e) => {
                let DesiredPage = Number(e.srcElement.value);
                if (DesiredPage <= this.TotalPages && DesiredPage > 0) {
                    this.i = DesiredPage;
                    window.scrollTo(0, 0);
                    this.paginationLoader();
                    this.PushState();
                } else {
                    alert('Invalid Request!');
                    PageInput.value = this.i;
                }
            }, 400))
        })
        .catch((error) => console.log(error));                
        
    };

    // Triggers loading gif to appear by changing class of div that encapsulates the whole list view
    paginationLoader() {
        document.querySelector('.content').classList.remove('loaded');
        document.querySelector('.content').classList.add('loading');
    };

    nextPage = () => {
        if(this.i > this.TotalPages) this.i = 1;
        else {
            this.i += 1;
            this.PushState();
        }
        window.scrollTo(0, 0);
    };
    
    prevPage = () => {
        this.i -= 1;
        if(this.i < 1) this.i = this.TotalPages;
        window.scrollTo(0, 0);
        this.PushState();
    };

    // Loading animation functions upon first page load to hide the API text from popping in after page loads
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

    debounce = (callback, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => { callback.apply(this, args); }, wait);
        };
    }

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
        }, 300))

        window.addEventListener('hashchange', (e) => {
            let page = parseInt(window.location.hash.replace('#', ''));
            if(isNaN(page)) page = 1;
            if(page > this.TotalPages || page <= 0) {
                this.i = 1;
                window.location.hash = 1;
            } else {
                this.i = page;
                this.getData();
            }
        })

        this.NextBtn.onclick = this.debounce(() => {
            this.nextPage();
        }, 300);
        this.PrevBtn.onclick = this.debounce(() => {
            this.prevPage();
        }, 300);

    };
}

const render = new ContentReaderFromURL()
render.setup();

