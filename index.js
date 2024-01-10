const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

// Loading animation functions upon page load to hide the API text from popping in after page loads
const loadingFade = () => {
    const loadingBg = document.querySelector('.loading__bg');
    const loadingImg = document.querySelector('.loading__img');
    loadingBg.style.opacity = "0";
    loadingImg.style.opacity = "0";
}

const loadingRemove = () => {
    const loading = document.querySelector('.loading');
    loading.style.display = "none";
}
const firstVisit = localStorage.getItem('visited');

if (firstVisit == null) {
    window.setInterval(loadingFade, 1500);
    window.setInterval(loadingRemove, 3000);
} else {
    loadingRemove();
}

const BASE_URL = 'https://www.adelphi.edu/wp-json/wp/v2/event?page='
let i = 1;

// Retrieves API data and alters text of unordered list in index.html to include results
const getData = (i) => {
    axios.get(`${BASE_URL}${i}`).then(response => {
        console.log(`GET adelphi data`, response);
        // const data = response.data;
        const {data} = response;
        const list = document.querySelector('.list-view');
        const page = document.querySelector('.page-count');
        const page2 = document.querySelector('.page-count-2');
        page.innerHTML = `<p>Page ${i} of 115</p>`;
        page2.innerHTML = `<p>Page ${i} of 115</p>`;
        console.log(page)


        data.forEach((entry) => {
            // Each individual event entry
            const listContentBlock = document.createElement('div');
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
            list.append(listContentBlock);
        });   
    })
    .catch((error) => console.log(error));


};

getData(i);
nextBtn.onclick = () => {
    i += 1;
    if(i == 116) i = 1;
    window.scrollTo(0, 0);
    document.querySelector('.list-view').innerHTML = "";
    getData(i);
}

prevBtn.onclick = () => {
    i -= 1;
    if(i == 0) i = 115;
    window.scrollTo(0, 0);
    document.querySelector('.list-view').innerHTML = "";
    getData(i);
}