export function saveSearchQuery(query) {
    localStorage.setItem("search-query", JSON.stringify(query));
}

export function getSearchQuery() {
    return JSON.parse(localStorage.getItem("search-query"));
}
