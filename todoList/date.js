exports.getDate = function() {
    const todaysDate = new Date();
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };
    return todaysDate.toLocaleDateString("en-US", options);
}

exports.getDay = function() {
    const todaysDate = new Date();
    const options = {
        weekday: "long"
    };
    return todaysDate.toLocaleDateString("en-US", options);
}