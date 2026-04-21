function toggleInputFieldType(inputField) {
    if (inputField.type === "password") {
        inputField.type = "text";
        return "text";
    } else {
        inputField.type = "password";
        return "password";
    }
}
function openPasswordIcon(icon) {
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
}
function closePasswordIcon(icon) {
    icon.classList.add("fa-eye");
    icon.classList.remove("fa-eye-slash");
}

export function handlePasswordFieldToggle(e) {
    if (!e.target.classList.contains("fas")) {
        console.log("y");
        return;
    }
    console.log("hm");
    const container = e.target.closest(".auth-form-input-field-container");
    const inputField = container.querySelector("input");
    const icon = e.target;
    if (toggleInputFieldType(inputField) === "text") {
        openPasswordIcon(icon);
    } else {
        closePasswordIcon(icon);
    }
}
