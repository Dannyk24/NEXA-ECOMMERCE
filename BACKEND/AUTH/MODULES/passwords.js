export function toggleInputFieldType(inputField) {
    if (inputField.type === "password") {
        inputField.type = "text";
        return "text";
    } else {
        inputField.type = "password";
        return "password";
    }
}
