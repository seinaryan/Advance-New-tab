document.addEventListener("DOMContentLoaded", function () {
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
    document.getElementById("searchInput").addEventListener("input", function (event) {
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

    // Function to handle "!" for Google search
    document.getElementById("searchInput").addEventListener("keydown", function (event) {
        const inputValue = event.target.value.trim();
        if (inputValue.startsWith("!") && event.key === "Enter") {
            const query = inputValue.slice(1).trim(); // Remove "!" from the query
            if (query) {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Populate bookmarks when the page loads
    populateBookmarks();
});
