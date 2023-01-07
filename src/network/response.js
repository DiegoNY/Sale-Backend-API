exports.success = function (req, res, message, status) {
    res.status(status || 200).send({
        error: '',
        body: message
    })
}
exports.error = function (req, res, message, status, detaills) {

    console.log('[response error]' + detaills);

    res.status(status || 500).send({
        error: message,
        body: ''
    })

}

exports.successDataApiV1 = function (req, res, message, status) {
    res.status(status || 200).send(message)
}
