const Koa = require("koa");
const Router = require("koa-router");
const mime = require("mime");
const fs = require("fs-extra");
const Path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");

// const Static = require('koa-static');

const app = new Koa();
const router = new Router();

const responseFile = async (path, context, encoding) => {
    const fileContent = await fs.readFile(path, encoding);
    context.type = mime.getType(path);
    context.body = fileContent;
};

// app.use(Static(
//     Path.join(__dirname, 'static')
// )) 
// 处理首页
router.get(/(^\/index(.html)?$)|(^\/$)/, async (ctx, next) => {
    await responseFile(Path.resolve(__dirname , "./static/index.html"), ctx, "UTF-8");
    await next();
});
router.get(/(^\/?$)|(^\/$)/, async (ctx, next) => {
    await responseFile(Path.resolve(__dirname , "./static/index.html"), ctx, "UTF-8");
    await next();
});

// 处理图片
router.get(/\S*\.(jpe?g|png)$/, async (ctx, next) => {
    const { request, response, path } = ctx;
    ctx.type = mime.getType(path);
    response.set("pragma", "no-cache");
    response.set("cache-control", "no-cache");

    console.log(request.headers);
    const ifNoneMatch = request.headers["if-none-match"];
    console.log(request.headers);
    const imagePath = Path.resolve(__dirname, `./static/${path}`);
    const hash = crypto.createHash("md5");
    const imageBuffer = await fs.readFile(imagePath);
    hash.update(imageBuffer);
    const etag = `"${hash.digest("hex")}"`; // 创建etag
    console.log('ifNoneMatch & etag', ifNoneMatch, etag);
    if (ifNoneMatch === etag) {
        response.status = 304;
    } else {
        console.log(etag)
        response.set("etag", etag);
        ctx.body = imageBuffer;
    }

    console.log(response)

    await next();
});

// 处理 css 文件
router.get(/\S*\.css$/, async (ctx, next) => {
    const { path } = ctx;
    console.log('__dirname', __dirname)
    await responseFile(Path.resolve(__dirname + "/static", `.${path}`), ctx, "UTF-8");
    await next();
});

app.use(router.routes()).use(router.allowedMethods());

// app.use(async (ctx, next) => {
//     ctx.set("Access-Control-Allow-Origin", "https://localhost:3000");
//     await next();
// });

const PORT = 1027;
const HOST = "localhost";
const serverURL = `http://${HOST}:${PORT}/`;
app.listen(PORT, HOST);
console.log(
    chalk.yellow("Server is running at:"),
    chalk.bold.underline.bgBlueBright.gray(serverURL)
);

process.on("unhandledRejection", (err) => {
    console.error("有 promise 没有 catch", err);
});
