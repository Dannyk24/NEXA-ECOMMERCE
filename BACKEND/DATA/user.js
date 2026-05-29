export let activeUser = getActiveUser() || {
    id: null,
    username: null,
    role: null,
    email: null,
    phoneNumber: null
}; //Stores the current active user for authorization and giving each user individual carts and other features

export let users = getUsers() || [
    {
        id: 1,
        username: "danieluser",
        email: "teckydan@gmail.com",
        password: "123456",
        role: "user",
        phoneNumber: null
    },
    {
        id: 2,
        username: "danieladmin",
        email: "olajiredaniel9002@gmail.com",
        password: "123456",
        role: "admin",
        phoneNumber: null
    }
];

export function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}
function getUsers() {
    return JSON.parse(localStorage.getItem("users"));
}
export function setActiveUser(id, username, role, email, phoneNumber) {
    activeUser.id = id;
    activeUser.username = username;
    activeUser.role = role;
    activeUser.email = email;
    activeUser.phoneNumber = phoneNumber;
}
export function saveActiveUser() {
    sessionStorage.setItem("active-user", JSON.stringify(activeUser));
}
function getActiveUser() {
    return JSON.parse(sessionStorage.getItem("active-user")); //If theres no activeUser,return null
}
export function checkActiveUser() {
    if (activeUser.id === null) {
        //Check if theres an active user to enforce some level of authorization
        return false;
    } else {
        return true;
    }
}

export function getUser(id) {
    const user = users.find((user) => user.id === id);
    return user;
}
