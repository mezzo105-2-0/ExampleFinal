const jsforce = require("jsforce");

const oauth2 = new jsforce.OAuth2({
  loginUrl: process.env.SF_LOGIN_URL,
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  redirectUri: process.env.SF_REDIRECT_URI,
});

//funzioni per export
function getAuthUrl() {
  return oauth2.getAuthorizationUrl();
}

function createConnection() {
  return new jsforce.Connection({ oauth2 });
}

//export
module.exports = {
  createConnection,
  getAuthUrl,
};
