exports.success = function (req, res, message, status) {
    res.status(status || 200).send({
        error: false,
        body: message
    })
}
exports.error = function (req, res, message, status, detaills) {

    console.log('[response error]' + detaills);

    res.status(status || 500).send({
        error: true,
        body: message,
    })

}

exports.successDataApiV1 = function (req, res, message, status) {
    res.status(status || 200).send(message)
}

exports.MESSAGES_ERROR = {
    LLAVE_DUPLICADA: { message: 'LLAVE DUPLICADA' },
    INFORMACION_REQUERIDA: { message: 'INFORMACION REQUERIDA' }
}