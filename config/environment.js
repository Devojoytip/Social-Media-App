// put all the passwords we used here in this file

// DEVELOPMENT ENVIRONMENT
const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'monkey swims in water the fish climbs the tree in my jungle',
    db: 'social_media_app_db',
    smtp:
    {
        service: 'gmail',
        // refer gmail smtp settings
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dark033770@gmail.com',
            //https://www.youtube.com/watch?v=qk8nJmIRbxk to solve 535-5.7.8 Username and Password not accepted issue
            pass: 'ovilxakxgpaonyci'
        }
    },
    google_client_ID: '304845680120-q7jamgah1jr2a2946eju1a8svf9k79v9.apps.googleusercontent.com',
    google_client_Secret: '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',
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'my secret key'
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp:
    {
        service: 'gmail',
        // refer gmail smtp settings
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.CODEIAL_GMAIL_USER,
            //https://www.youtube.com/watch?v=qk8nJmIRbxk to solve 535-5.7.8 Username and Password not accepted issue
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_ID: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET
}
// CODEIAL_ENVIRONMENT='production'
module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);