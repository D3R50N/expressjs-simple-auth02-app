function nullOrUndefined(val) {
    return val == null || val == undefined || val.toString().trim() == "";
}

module.exports = {
    nullOrUndefined,
}