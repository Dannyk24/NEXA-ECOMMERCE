export function checkStringLength(string, length = 6) {
    if (string.trim().toLowerCase().length < length) {
        return false;
    } else {
        return true;
    }
}
