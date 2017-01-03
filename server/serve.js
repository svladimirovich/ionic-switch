'use strict';

var http = require('http');
var fs = require('fs');
const switchUrlPattern = /\/api\/set\/(\d+)\/(on|off)$/;

http.createServer(function(request, response) {

    var target_file = "/index.html";
    var target_content_type = "text/html";
    if(request.url === '/') {
        giveEmTheFile();
    } else {
        target_file = request.url;
        if(request.url.endsWith(".js")) {
            target_content_type = "text/javascript";
            giveEmTheFile();
        } else if(request.url.endsWith(".ico")) {
            target_content_type = "image/x-icon";
            giveEmTheFile();
        } else if(request.url.endsWith(".html")) {
            target_content_type = "text/html";
            giveEmTheFile();
        } else if(request.url.endsWith(".css")) {
            target_content_type = "text/css";
            giveEmTheFile();
        } else if(request.url === "/api/list") {
            var readable = fs.createReadStream(__dirname + '/switch-settings.json');
            readable.pipe(response);
            response.writeHead(200, {
                'Content-Type': "application/json",
                "Access-Control-Allow-Origin": "*",
                //"Access-Control-Allow-Methods": "GET, POST"
            });    
        } else {
            var match = switchUrlPattern.exec(request.url);
            if(match) {
                var requestSettings = {
                    id: match[1],
                    online: match[2]
                };
                serveSetRequest(requestSettings.id, requestSettings.online, response);
            } else {
                yieldError("Request to unknown resource.", response, 404);
            }
        }
    }

    function yieldError(message, response, code = 500) {
        response.writeHead(code);
        response.write("Error: " + message, "utf8");
        response.end();
    }
    
    function serveSetRequest(deviceId, isOnline, response) {
        fs.readFile(__dirname + '/switch-settings.json', 'utf8', function(err, data) {
            if(err) {
                yieldError(`some uglyass error has occured: ${ err }`, response)
            } else { 
                var switchSettings = eval(data);
                var success = false;
                for(var i = 0; i < switchSettings.length; i++) {
                    if(switchSettings[i].id == deviceId) {
                        switchSettings[i].online = isOnline;
                        success = true;
                        break;
                    }
                }
                if(success) {
                    fs.writeFile(__dirname + '/switch-settings.json', JSON.stringify(switchSettings), 'utf8', (err) => {
                        if(err) {
                            yieldError(`Could not save settings: ${err}.`, response);
                        } else {
                            var readable = fs.createReadStream(__dirname + '/switch-settings.json');
                            readable.pipe(response);
                            response.writeHead(200, {
                                'Content-Type': "application/json",
                                "Access-Control-Allow-Origin": "*",
                                //"Access-Control-Allow-Methods": "GET, POST"
                            });    
                        }
                    });
                } else {
                    yieldError(`Device:${ deviceId } not found.`, response)
                }
            }
        });        
    }

    function giveEmTheFile() {
        var readable = fs.createReadStream(__dirname + target_file);
        //response.end('Hello world\n');
        readable.pipe(response);
        response.writeHead(200, {
            'Content-Type': target_content_type
        });    
    }

    console.log(">>> Listing Headers: >>>");
    for(var header in request.headers) {
        console.log(`${header}: ${request.headers[header]}`);
    }
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(new Date() + " response served.");
}).listen(80, '127.0.0.1');
//}).listen(8080, '192.168.0.105');

console.log("lilserver started. (Ctrl+C to quit)");