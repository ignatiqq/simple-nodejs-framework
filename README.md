Super simple middleware based executing flow framework. 

Supports:
* http/ws
* HTTP2 features supported.
* information responses (EarlyHints)

----
HTTP2 support

```
const app = new Application();
const server = http2.createServer({}, app.callback());
server.listen(443);
```