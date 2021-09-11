const Koa = require("koa");
const cors = require("koa2-cors");
const app = new Koa();
const Router = require("koa-router");
const mime = require("mime");
const router = new Router();

// 设置跨域
app.use(
    cors({
        origin: function (ctx) {
            //设置允许来自指定域名请求
            if (ctx.url === "/test1") {
                return "*"; // 允许来自所有域名请求
            }
            if (ctx.url === "/test2") {
                return "http://localhost:8083"; // 允许来自所有域名请求
            }
            return "http://dev.djtest.cn"; // 只允许http://localhost:8080这个域名的请求
        },
        maxAge: 20, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法'
        allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
        exposeHeaders: [
            "WWW-Authenticate",
            "Server-Authorization",
            "Content-length",
        ], //设置获取其他自定义字段
    })
);
// jsonp 跨域
router.get("/jsonp", async (ctx, next) => {
    const { query } = ctx;
    if (query.callback) {
        ctx.body = `
        ${query.callback}([
            {
                company: 'bytedance',
                start: '10:30',
                end: '9:00',
                days: 5.5
            },
            {
                company: 'pdd',
                start: '11:00',
                end: '11:00',
                days: 6
            }
        ])
        `;
        ctx.type = mime.getType(".js");
    }

    await next;
});
app.use(router.routes());

app.use((ctx) => {
    ctx.status = 200;
    ctx.body = "ok";
}).listen(3011, () => console.log("Listening 3011"));
