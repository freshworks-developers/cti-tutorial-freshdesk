exports = {
  getAgent: async function (args) {
    try {
      const token = await fetchAccessToken(args);
      const account = await fetchUserProfile(token);
      renderData(null, { account: account });
    } catch (error) {
      console.error('getAgent failed', error);
      renderData(error);
    }
  }
};

async function fetchAccessToken(args) {
  const credentials = `${args.iparams.zoom_client_id}:${args.iparams.zoom_client_secret}`;
  const response = await $request.invokeTemplate('zoomAccessToken', {
    context: { basic_credentials: credentials },
    body: `grant_type=account_credentials&account_id=${encodeURIComponent(args.iparams.zoom_account_id)}`
  });
  return JSON.parse(response.response).access_token;
}

async function fetchUserProfile(accessToken) {
  const response = await $request.invokeTemplate('zoomUserMe', {
    context: { access_token: accessToken }
  });
  const user = JSON.parse(response.response);
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return {
    id: user.id,
    email: user.email,
    display_name: name || user.email
  };
}
