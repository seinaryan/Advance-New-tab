document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    searchInput.focus();
    // get bookmarks
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log('Bookmarks:', bookmarkTreeNodes);
      });
      
    const performSearch = () => {
        const query = searchInput.value.trim(); // Get and trim input value
        if (query) {
            const searchURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(searchURL, "_blank"); // Open search in a new tab
        } else {
            alert("Please enter a search query."); // Alert if input is empty
        }
    };

    // Trigger search on button click
    searchButton.addEventListener("click", performSearch);

    // Trigger search on Enter key press in the input field
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission or default action
            performSearch(); // Perform the search
        }
    });
});
