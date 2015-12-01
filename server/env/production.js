module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "FACEBOOK": {
        "clientID": process.env.FACEBOOK_APP_ID,
        "clientSecret": process.env.FACEBOOK_CLIENT_SECRET,
        "callbackURL": process.env.FACEBOOK_CALLBACK_URL
    }
};