const express = require("express");

const app = express();

app.get("/hello", (request, response) => {
  response.json({message: "hello world"});
}); 

app.listen(8000, () => {
  console.log("server has started");
});