//tcp服务端
var net = require("net");
var sever = net.createServer(function (connection) {
    //客户端关闭连接执行的事件
    connection.on("end", function () {
        console.log("客户端关闭连接");
    });
    connection.on("data", function (data) {
        console.log("服务端：收到客户端发送数据为\r" + data.toString());
    });
    //给客户端响应的数据 http报文
    connection.end(`
        HTTP/1.1 200 OK
        Server Hello

        hellow World
   `);

    //  connection.write('response hello')
});
sever.listen(3004, function () {
    console.log("监听端口 3004");
});
