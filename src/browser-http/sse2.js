const Koa = require("koa");
const { PassThrough } = require("stream");
const EventEmitter = require("events");

const events = new EventEmitter();
events.setMaxListeners(0);

const interval = setInterval(() => {
    events.emit("data", new Date().getTime());
}, 1000);

const app = new Koa();
app.use(async (ctx, next) => {
    if (ctx.path !== "/sse") {
        return await next();
    }

    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    const stream = new PassThrough();
    ctx.status = 200;
    ctx.body = stream;

    const listener = (data) => {
        stream.write(`data: ${data}\n\n`);
    };

    events.on("data", listener);

    stream.on("close", () => {
        events.off("data", listener);
    });
});
app.use((ctx) => {
    ctx.status = 200;
    ctx.body = "ok";
}).listen(3009, () => console.log("Listening 3009"));
