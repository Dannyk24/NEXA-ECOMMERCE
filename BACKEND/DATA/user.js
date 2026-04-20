export const users = getUsers() || [
    {
        id: 1,
        username: "danieluser",
        email: "teckydan@gmail.com",
        password: "12345",
        role: "user"
    },
    {
        id: 2,
        username: "danieladmin",
        email: "olajiredaniel9002@gmail.com",
        password: "12345",
        role: "admin"
    }
];

export function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}
function getUsers() {
    return JSON.parse(localStorage.getItem("users"));
}
