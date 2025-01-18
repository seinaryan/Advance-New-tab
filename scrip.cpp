#include <bits/stdc++.h>
using namespace std;

string google_search(string search_string) {
    // Remove the '!' from the search string
    search_string.erase(0, 1);

    cout << "Google search: " << search_string << endl;
    string url = "https://www.google.com/search?q=" + search_string;
    cout << "Generated URL: " << url << endl;

    return url;
}

void bookmark_search(const string& search_string, vector<string>& results) {
    vector<string> filtered_results;

    for (const string& bookmark : results) {
        if (bookmark.substr(0, search_string.size()) == search_string) {
            filtered_results.push_back(bookmark);
        }
    }

    results = filtered_results;

    if (results.empty()) {
        cout << "No bookmarks found for: " << search_string << endl;
    } else if (results.size() == 1) {
        cout << "Bookmark found: " << results[0] << endl;
    } else {
        cout << "Multiple bookmarks found: ";
        for (const string& res : results) {
            cout << res << " ";
        }
        cout << endl;
    }
}

void search_function(const vector<string>& bookmarks) {
    string search_string;
    vector<string> matching_bookmarks = bookmarks;

    while (true) {
        cout << "Enter a character (! for Google search, 'exit' to quit): ";
        char temp;
        cin >> temp;

        if (temp == '!') {
            cout << "Enter Google search string: ";
            cin >> search_string;
            google_search(search_string);
            search_string.clear();
            matching_bookmarks = bookmarks;
        } else if (temp == 'x') {
            cout << "Exiting search function." << endl;
            break;
        } else {
            search_string += temp;
            bookmark_search(search_string, matching_bookmarks);

            if (matching_bookmarks.size() == 1) {
                cout << "Suggestion: " << matching_bookmarks[0] << endl;
                break; // Exit loop once a single match is found
            } else if (matching_bookmarks.empty()) {
                search_string.clear(); // Reset search on failure
                matching_bookmarks = bookmarks;
            }
        }
    }
}

int main() {
    vector<string> bookmarks = {"youtube", "google", "facebook", "instagram", "twitter", "teet", "twitch", "youmusic"};
    search_function(bookmarks);

    return 0;
}
