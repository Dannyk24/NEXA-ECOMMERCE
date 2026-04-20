export function formatString(string) {
    return string.trim().toLowerCase();
}
export function capitalize(string) {
    const textArray = string.split(" ");
    let fullArray = [];
    textArray.forEach((text) => {
        const firstLetter = text[0].toUpperCase();
        let remainingPart = "";
        for (let i = 0; i < text.length; i++) {
            if (i === 0) {
                continue;
            }
            const letter = text[i];
            remainingPart += letter;
        }
        const formattedText = firstLetter + remainingPart;
        fullArray.push(formattedText);
    });
    return fullArray.toLocaleString().replaceAll(",", " "); //toLocaleString() converts an array to a string and serperates each element by a comma, user replace to replace all commas wtih spaces
}
