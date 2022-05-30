const { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

const createToken = async (request, response) => {
  const clientUserId = '1';
  const tokenRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: clientUserId,
    },
    client_name: 'Plaid Test App',
    products: [Products.Auth],
    language: 'en',
    webhook: 'https://webhook.example.com',
    redirect_uri: 'https://domainname.com/oauth-page.html',
    country_codes: [CountryCode.Us],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(tokenRequest);
    response.json(createTokenResponse.data);
    console.log(createTokenResponse)
  } catch (error) {
    console.log(error)
    // handle error
  }
}

module.exports = {
  createToken
};