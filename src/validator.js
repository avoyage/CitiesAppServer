// @flow

const isUsernameValid = (username: string): boolean => {
  const re = new RegExp(/[A-Za-z0-9_]+/);
  return !!(username && username.length <= 15 && re.test(username));
};

const isFirstNameValid = (firstName: string): boolean => {
  return firstName.length <= 15;
};

const isLastNameValid = (lastName: string): boolean => {
  return lastName.length <= 15;
};

const isHashValid = (hash: string): boolean => {
  return !!(hash && hash.length === 60);
};

const isPasswordValid = (password: string): boolean => {
  return !!(password && password.length >= 6);
};

const Validator: {[id: string]: Function} = {
  isCreateUserInputsValid(username: string, hash: string, firstName: string, lastName: string): boolean {
    return isUsernameValid(username) &&
      isHashValid(hash) &&
      isFirstNameValid(firstName) &&
      isLastNameValid(lastName);
  },

  isLoginParamsValid(username: string, password: string) {
    return isUsernameValid(username) && isPasswordValid(password);
  }
};

export default Validator;

