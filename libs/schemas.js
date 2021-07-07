module.exports =  {
     requestSchema: {
        schema: {
            body: {
                type: 'array',
                description: 'request body',
                minItems: 1,
                uniqueItems: true,
                items: {
                    type: 'object',
                    required: ['name', 'content'],   
                    properties: {
                        name: { type: 'string' },
                        content: { type: 'string' }
                    }
                }
            }
        }
    }
}