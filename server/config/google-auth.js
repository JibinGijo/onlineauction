const path = require('path');
const credentials = require('./google-credentials.json');

module.exports = {
    clientID: credentials.web.client_id,
    clientSecret: credentials.web.client_secret,
    callbackURL: credentials.web.redirect_uris[0],
    authorizationURL: credentials.web.auth_uri,
    tokenURL: credentials.web.token_uri
}; 