require('make-promises-safe')
const schemas = require("./libs/schemas")
const validateHelper = require("./libs/precompile")
const fastify = require('fastify')({
    logger: true,
    bodyLimit: 1048576 * 100
})
fastify.post('/schema/precompile', schemas.requestSchema, async (request) => {
    let result = await validateHelper.validateResult(request.body)
    return result
})

fastify.post('/schema/metadata', schemas.requestSchema, async (request) => {
    let result = await validateHelper.cubeMetas(request.body)
    return result
})
// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000, "0.0.0.0")
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()