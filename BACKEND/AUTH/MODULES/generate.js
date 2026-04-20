import { users } from "../../DATA/user.js";

export function generateUserId() {
    const lastUser = users[users.length - 1];
    const newId = lastUser.id + 1;
    return newId;
}
