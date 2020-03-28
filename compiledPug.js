const pug = require("pug");

const compiledFunctionEmail = pug.compileFile('email.pug');
const compiledFunctionForgotPassword = pug.compileFile('forgotPassword.pug');

module.exports.compiledFunctionEmail = compiledFunctionEmail;
module.exports.compiledFunctionForgotPassword = compiledFunctionForgotPassword;