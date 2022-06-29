// including library
const mongoose = require('mongoose');

const env = require('./environment');

// connect to db
async function main() {
    await mongoose.connect(`mongodb://localhost:27017/${env.db}`);
}

// acquire connection to check if its successful
const db=mongoose.connection;

// error
db.on('error',console.error.bind(console,'error connecting to db'));

// up and running then print the message
db.once('open',()=>{
    console.log("Connected successfully !!!");
})
main().catch(err => console.log(err));
