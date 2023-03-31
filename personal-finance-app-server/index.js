const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': CLIENT_ID,
      'PLAID-SECRET': SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/hello", (request, response) => {
  response.json({message: "hello " + request.body.name});
}); 

app.listen(8000, () => {
  console.log("server has started");
});