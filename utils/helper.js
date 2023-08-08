errCek = function(errors, nama) {
    const error = errors.find((error) => error.param === nama)
    if (error) {
        return 'is-invalid'
    }
}

errMsg = function(errors, nama) {
    const error = errors.find((error) => error.param === nama)
    if (error) {
        return error.msg
    }
}

val = function(value, name) {
    if (value.length !== 0) {
        return value[0][name]
    }
}

module.exports = {errCek, errMsg, val}