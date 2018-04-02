import config, {nodeEnv, logStars} from "./config";

/*
  console.log("server.js - should import config file here");
  console.log(config);
  console.log(nodeEnv);
  logStars("logStars Message");
*/

/*
import https from "https";

https.get("https://www.lynda.com", res => {
  console.log("www.lynda.com response: ", res.statusCode);

  res.on("data", chunk => {
    //console.log(chunk.toString());
  })
});
*/



import http from "http";

const server = http.createServer();

server.listen(8080);




server.on("request", (req, res) => {
  console.log("request/response: ", req.toString());
  res.write("Hello HTTP!\n")

  setTimeout(() => {
    res.write("timeout 3 seconds");
      res.end();
  }, 3000)


});
