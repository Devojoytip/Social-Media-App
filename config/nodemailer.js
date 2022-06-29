const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

// it sends email & so defines communication
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   // refer gmail smtp settings
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: 'dark033770@gmail.com',
//     //https://www.youtube.com/watch?v=qk8nJmIRbxk to solve 535-5.7.8 Username and Password not accepted issue
//     pass: 'ovilxakxgpaonyci'
//   }
// });
let transporter = nodemailer.createTransport(env.smtp);


let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, '../views/mailers', relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log('Error in rendering template', err);
      }
      mailHTML = template;
    }
  )
  return mailHTML;
}

module.exports = {
  transporter,
  renderTemplate
}