# cube.js schema pre compiler rest api


## how to use


*  validate request path 

```code
http://<host>:<port>/schema/precompile
```

* validate reqeust format

> method: post content-type: application/json

```code
[
    {
        name:"schema.js",
        content:<base64 encode schema content>
    }
]
```