import React, { useEffect, useState } from 'react';
import Link from "./Link";

const App = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({ accessToken: ''});
  const [accounts, setAccounts] = useState<any[]>([])
  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
    });

    const data = await response.json();
    setLinkToken(data.link_token);
    console.log(data)
  };

  const getAccounts = () => {
    fetch('/accounts/balance/get', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: tokenInfo?.accessToken,
        accountId: '1'
      })
    }).then((r) => r.json().then(c => setAccounts(c)));
  }

  useEffect(() => {
    generateToken();
  }, []);
  return (
    <>
      {linkToken !== null ? <Link setTokenInfo={setTokenInfo} linkToken={linkToken} /> : <></>}
      <p>
        <button type="button" onClick={() => getAccounts()}>Accounts</button>
      </p>
      { accounts && accounts.map((i,j) => <p key={j}>Account: {i.name}, Balance: ${i.balances.available}</p>)}
    </>
  )
};

export default App;