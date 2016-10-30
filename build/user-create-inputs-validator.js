"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isUsernameValid = function isUsernameValid(username) {
  var re = new RegExp(/[A-Za-z0-9_]+/);
  return !!(username && username.length <= 15 && re.test(username));
};

var isFirstNameValid = function isFirstNameValid(firstName) {
  return firstName.length <= 15;
};

var isLastNameValid = function isLastNameValid(lastName) {
  return lastName.length <= 15;
};

var isHashValid = function isHashValid(hash) {
  return !!(hash && hash.length === 60);
};

var userCreateInputsValidator = {
  isInputsValid: function isInputsValid(username, hash, firstName, lastName) {
    return isUsernameValid(username) && isHashValid(hash) && isFirstNameValid(firstName) && isLastNameValid(lastName);
  }
};

exports.default = userCreateInputsValidator;