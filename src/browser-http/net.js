const net = require('net')

// 使用net模块创建服务器，返回的是一个原始的socket对象，与Socket.io的socket对象不同。
const server = net.createServer((socket) => {
    socket.on("data", (buffer) => {
        const str = buffer.toString()
        // console.log(str)
 /*
1）请求方法URI协议/版本

以上请求中“GET”代表请求方法，“/sample.jsp”表示URI，“HTTP/1.1代表协议和协议的版本。

根据HTTP标准，HTTP请求可以使用多种请求方法。具体的方法以及区别后面我们介绍。

2）请求头

Accept 可接受的内容类型
Accept-Language 语言
Connection连接状态
Host 请求的域名（这里我设置的是请求本地，当然，关于域名，就是所谓的URL）
User-Agent 浏览器端浏览器型号和版本
Accept-Encoding 可接受的压缩类型 gzip,deflate
 
3）请求正文
请求头和请求正文之间是一个空行，它表示请求头已经结束，接下来的是请求正文。请求正文中可以包含客户提交的查询字符串信息：

username=jinqiao&password=1234

在以上的例子中，请求的正文只有一行内容。当然，在实际应用中，HTTP请求正文可以包含更多的内容。

 
响应的构成
HTTP响应与HTTP请求相似，HTTP响应也由3个部分构成：

1）状态行

2）响应头

3）响应正文
 */

        const myData = "<h1>哈哈Hello</h1>"

        socket.write("HTTP/1.1 200 OK")
        socket.write("\r\n")
        socket.write(`Content-Length: ${Buffer.from(myData).length}`)
        socket.write("\r\n")
        socket.write("Content-Type: text/html; charset=utf-8")
        // socket.write("Content-Type: application/json; charset=utf-8")
        socket.write("\r\n")
        socket.write("SLI:97");
        socket.write("\r\n")
        socket.write("\r\n")
        socket.write(myData);
        socket.write("\r\n")
        socket.end()
    })
})

server.on("connection", (socket) => {
    console.log("有人连接上了")
})

// server.on("close", (socket) => {
//     console.log("关闭了")
// })

server.listen(3004, () => {
    console.log("your application is run at http://localhost:3004")
})
