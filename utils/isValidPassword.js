const isValidPassword = (password) => {
  // At least 7 characters
  const passwordRegex = /^.{7,}$/;
  return passwordRegex.test(password);
};
  
module.exports = isValidPassword;
