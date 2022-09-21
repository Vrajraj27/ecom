module.exports.statusTrue = (message, data) => {
    return {
        status: true,
        message: message || "",
        data: data || null,
    };
};
module.exports.statusFalse = (message, data, title) => {
    return {
        status: false,
        message: message || "",
        data: data || null,
        title: title || null,
    };
};