var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");

function errorResponse(response, errCode, errMsg) {
    response.writeHead(errCode, {"Content-Type": "text/plain"});
    response.write(errMsg + "\n");
    response.end();
}
function response500(response, errMsg) {
    errorResponse(response, 500, errMsg);
}
function response404(response) {
    errorResponse(response, 404, "File not found");
}

http.createServer((request, response) => {
    var uri = url.parse(request.url).pathname;
    filename = path.join(process.cwd(), (uri == '/')? '/app': uri);
    console.log(filename);

    fs.exists(filename, (exists) => {
        if (!exists)
            return response404(response);

        if (fs.statSync(filename).isDirectory())
            filename = filename + '/' + 'index.html';

        fs.readFile(filename, "binary", (err, file) => {
            if (err)
                return response500(response, err.toString());

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(8081);

console.log("Server is listening on port 8081");
