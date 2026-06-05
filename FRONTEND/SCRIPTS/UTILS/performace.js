let timeoutId;
export function debounce(func, delay) {
    clearTimeout(timeoutId);
    return function (param) {
        timeoutId = setTimeout(() => {
            func(param);
        }, delay);
    };
}
