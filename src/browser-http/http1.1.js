// http1.1服务端代码
 
const fs = require('fs')
const path = require('path')
const Koa = require('koa');
const static = require('koa-static');
const app = new Koa();
const compress = require('koa-compress');
// 配置静态web服务的中间件
const staticPath =path.join( __dirname, './static');
app.use(static( staticPath,{maxage:10000000}));
 
app.use(compress({
  filter (content_type) {
    console.log(content_type)
  	return /javascript/i.test(content_type)
  },
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH,
  },
  br: false // disable brotli
}))

app.use(ctx => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./static/index1.html');
})
 
 
app.listen(3005, (err) => {
  console.log(`http Server listening on 3005`)
})