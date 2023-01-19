const getUserByEmail = (email, database) => {
  
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return {};
};

module.exports = getUserByEmail;