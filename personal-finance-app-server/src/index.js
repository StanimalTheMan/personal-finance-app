import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express";
import cors from "cors";
import pkg from 'body-parser';
const { json } = pkg;
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.CLIENT_ID,
      'PLAID-SECRET': process.env.SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const app = express();
app.use(cors());
app.use(json());

app.post("/hello", (request, response) => {
  response.json({message: "hello " + request.body.name});
});

app.post('/create_link_token', async function (request, response) {
  // Get the client_user_id by searching for the current user
  // const user = await User.find(...);
  // const clientUserId = user.id;
  const plaidRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user',
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    // webhook: 'https://webhook.example.com',
    redirect_uri: 'http://localhost:5173/',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    response.status(500).send("failure");
    // handle error
  }
});

app.post('/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  console.log(publicToken)
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    console.log(plaidResponse)
    const accessToken = plaidResponse.data.access_token;
    console.log(accessToken)
    const itemID = plaidResponse.data.item_id;

    response.json({ accessToken });
  } catch (error) {
    // handle error
    response.status(500).send("failed");
  }
});

app.listen(8000, () => {
  console.log("server has started");
});