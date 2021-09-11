const Koa = require("koa");
const app = new Koa();

// response
app.use(async (ctx) => {
    let rel = await Promise.race([delay(1000 * 5), getRel(1000 * 10)]);
    ctx.body = rel;
});

function delay(ms) { //超时 
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("delayed");
        }, ms);
    });
}

function getRel(ms) { //设置一个 保持时间
    return new Promise((resolve) => {
        let time = new Date();
        let it = setInterval(() => {
            if (Date.now() - time > ms) {
                clearInterval(it);
                resolve("gotRel");
            }
        }, 20);
    });
}

const port = 3000;

app.listen(port, (err) => {
    if (err) {
        console.error(`err: ${err}`);
    }
    console.log(`server start listening ${port}`);
});

// 这是超时的情况，这里是 getRel(1000 * 20)

// 这是返回了数据的情况，这里是 getRel(1000 * 5)
