// Using Express
const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();

const { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_CLIENT_SECRET,
      'Plaid-Version': '2020-09-14'
    },
  },
});

const client = new PlaidApi(configuration);

app.post("/api/create_link_token", async (request, response) => {
  const clientUserId = '1';
  const tokenRequest = {
    user: {
      client_user_id: clientUserId,
    },
    client_name: 'Le Budget',
    products: [Products.Auth],
    language: 'en',
    country_codes: [CountryCode.Us],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(tokenRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    console.log(error)
  }
});

app.post('/api/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
    const createPublicTokenResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = createPublicTokenResponse.data.access_token;
    const itemID = createPublicTokenResponse.data.item_id;
    response.json({ accessToken: accessToken, itemID: itemID })
  } catch (error) {
    console.log(error)
  }
});

app.post("/accounts/balance/get", async (request, response) => {
  try {
    const { access_token } = request.body;
    const balanceRequest = {
      'access_token': access_token,
    };
    const balanceResponse = await client.accountsBalanceGet(balanceRequest);
    const accounts = balanceResponse.data.accounts;
    response.json(accounts)
  } catch (error) {
    console.log(error)
    // handle error
  }
});

const port = 3005;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})