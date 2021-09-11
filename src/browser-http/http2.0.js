// http2服务端代码
 
const http2 = require('http2')
const fs = require('fs')
const path = require('path')
const Koa = require('koa');
const koaStatic = require('koa-static');
const app = new Koa();
// 配置静态web服务的中间件
app.use(koaStatic(path.join( __dirname, './static')));
 
app.use(ctx => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./static/index2.html');
})
//  创建http2 server
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, './public/localhost.crt')),
  key: fs.readFileSync(path.join(__dirname, './public/localhost.key'))
}, app.callback())

server.listen(3006, (err) => {
  console.log(`Server listening on 3006`)
})