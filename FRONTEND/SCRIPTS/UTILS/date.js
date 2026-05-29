export function checkNewDay() {
    const now = new Date();
    const currentDateObject = {
        day: now.getDate(),
        month: now.getMonth() + 1, //Months start fom 0 so we add 1 to get the current month
        year: now.getFullYear()
    };
    let lastDateObject;
    let newDay;
    if (!localStorage.getItem("last-date-object")) {
        localStorage.setItem(
            "last-date-object",
            JSON.stringify(currentDateObject)
        );
        return true;
    }
    lastDateObject = JSON.parse(localStorage.getItem("last-date-object"));
    if (
        currentDateObject.year > lastDateObject.year ||
        currentDateObject.month > lastDateObject.month ||
        currentDateObject.day > lastDateObject.day
    ) {
        newDay = true;
    } else {
        newDay = false;
    }
    localStorage.setItem("last-date-object", JSON.stringify(currentDateObject));
    return newDay;
}

export function getCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const date = `${day}/${month}/${year}`;
    return date;
}
//checkNewDay() checks if the currnet day is a new day compared to when last the user logged in, if it is, it returns true. if it isnt it returns false
