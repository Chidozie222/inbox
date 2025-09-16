const bcrypt = require("bcryptjs");

const setPassword = async (password) => {
    
    let passwordHash = await bcrypt.hash(password, 10);
    return passwordHash
};

const validatePassword = async (password) => {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = setPassword