const { prepareCompiler } = require("@cubejs-backend/schema-compiler");
const ramda = require("ramda")
function preCompiler(name, content, options) {
    return prepareCompiler({
        localPath: () => __dirname,
        dataSchemaFiles: () => Promise.resolve([
            { fileName: name, content }
        ])
    }, { adapter: 'mydremio', ...options });
};
module.exports = {
    validateResult: async function (schemaContents) {
        const schemavalidates = await Promise.all(
            schemaContents.map(async (item) => {
                let schemaContent = new Buffer.from(item.content, 'base64').toString()
                let result = ""
                let status = 200
                try {
                    const { compiler } = preCompiler(item.name, schemaContent)
                    result = await compiler.compile();
                } catch (error) {
                    status = 500
                    result = error.messages
                }
                return {
                    name: item.name,
                    result: result,
                    status: status
                }
            })
        );
        let validateStatus = ramda.any(item => {
            return item.status === 500
        })(schemavalidates) ? 500 : 200
        return {
            messages: schemavalidates,
            status: validateStatus || 200
        };
    },
    cubeMetas: async function (schemaContents) {
        const schemaMetaDatas = await Promise.all(
            schemaContents.map(async (item) => {
                let schemaContent = new Buffer.from(item.content, 'base64').toString()
                let errorResult = ""
                let result = {};
                let status = 200
                try {
                    const { compiler, metaTransformer } = preCompiler(item.name, schemaContent)
                    await compiler.compile();
                    result = metaTransformer.cubes.map(c => c.config)
                    if (result && result.length) {
                        result = result[0]
                    }
                } catch (error) {
                    status = 500
                    errorResult = error.messages
                }
                return {
                    filename: item.name,
                    result: result,
                    errorMsg: errorResult,
                    status: status
                }
            })
        );
        let validateStatus = ramda.any(item => {
            return item.status === 500
        })(schemaMetaDatas) ? 500 : 200
        return {
            messages: schemaMetaDatas,
            status: validateStatus || 200
        };
    },
}