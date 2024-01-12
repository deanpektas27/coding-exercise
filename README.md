# coding-exercise By Dean Pektas
**<u>Task</u>**
    Write JS/HTML/CSS code to load and display event data into a listview from the provided API. You can navigate the pages of events within the API by providing the desired page number to the URL parameter "?page=". Please refrain from using a framework, but feel free to utilize JQuery and/or Axios.

**<u>Current Implementation Includes:</u>**

- Responsive design using CSS that displays a grid of all events available per page on desktop and transforms into a single column list-view on smaller/mobile screens using CSS media queries.
- Multiple navigation options, all with debounce functionality that prevents multiple API calls at once.
  - Arrow buttons above the list view that can be clicked/tapped on.
  - Detects left and right arrow key input on desktop keyboard.
  - Input field for custom page request above the arrow buttons.
  - Push/Pop state for every request made which adds the current page number to the current web address, allowing user to return to previous page by clicking the back button on the browser.
- Scroll to top button that appears once user scrolls down list allowing for quick return to top of list.