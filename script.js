document.addEventListener("DOMContentLoaded", function () {
    // Automatically focus the search bar when the page loads
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    // Function to toggle dropdown visibility
    window.toggleDropdown = function () {
        const dropdown = document.getElementById("drop-down-content");
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    };

    // Function to dynamically populate bookmarks
    function populateBookmarks() {
        chrome.bookmarks.getRecent(30, function (bookmarks) {
            if (chrome.runtime.lastError) {
                console.error("Error fetching bookmarks:", chrome.runtime.lastError);
                return;
            }

            const dropdownContent = document.getElementById("drop-down-content");
            // Clear any existing items (except search input)
            Array.from(dropdownContent.children).forEach(child => {
                if (child.tagName !== "INPUT") child.remove();
            });

            bookmarks.forEach(bookmark => {
                const item = document.createElement("div");
                item.textContent = bookmark.title;
                item.className = "bookmark-item";
                // Open the URL in the same tab when clicked
                item.onclick = () => {
                    window.location.href = bookmark.url;
                };
                dropdownContent.appendChild(item);
            });
        });
    }

    // Function to filter bookmarks based on search input
    searchInput.addEventListener("input", function (event) {
        const filter = event.target.value.toLowerCase();
        const items = document.querySelectorAll(".bookmark-item");
        let visibleItems = 0;
        let lastVisibleItem = null;

        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(filter)) {
                item.style.display = "block";
                visibleItems++;
                lastVisibleItem = item; // Keep track of the last visible item
            } else {
                item.style.display = "none";
            }
        });

        // Automatically click the only visible option if there's just one left
        if (visibleItems === 1 && lastVisibleItem) {
            lastVisibleItem.click();
        }
    });

    // Handle "Enter" key behavior
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const inputValue = event.target.value.trim();
            const visibleItems = document.querySelectorAll(".bookmark-item:not([style*='display: none'])").length;

            // If input starts with "!", perform a Google search directly
            if (inputValue.startsWith("!")) {
                const query = inputValue.slice(1).trim();
                if (query) {
                    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                }
            }
            // If no visible bookmarks, perform a Google search with the input text
            else if (visibleItems === 0 && inputValue) {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(inputValue)}`;
            }
        }
    });

    // Populate bookmarks when the page loads
    populateBookmarks();
});
