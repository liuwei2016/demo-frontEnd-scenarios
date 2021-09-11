const Koa = require("koa");
const { PassThrough } = require("stream");

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

    let interval = setInterval(() => {
        stream.write(`data: ${new Date().getTime()}\n\n`);
    }, 1000);
    stream.on("close", () => {
        console.log("close stream");
        clearInterval(interval);
    });
});
app.use((ctx) => {
    ctx.status = 200;
    ctx.body = "ok";
}).listen(3008, () => console.log("Listening 3008"));

/* client 
注意两点：第一，输出数据必须符合SSE格式。其次，必须返回一个流作为主体响应，以确保 Koa 不会关闭连接。您可以深入 Koa 源代码（检查此方法）以查看 Koa 如何处理响应。
如果您看一下，您会看到 Koa 会将正文内容发送到 HTTP 响应流，除非您使用另一个流作为正文。在这种情况下，它将通过管道传输流；因此，在我们关闭 PassThrough 流之前，不会关闭响应流。

const source = new EventSource("http://localhost:3008/sse");
source.onopen = () => console.log("Connected");
source.onerror = console.error;
source.onmessage = function(info){
 console.log(info.data);
};
*/
