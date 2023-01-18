const getUserByEmail = (email, database) => {
  // const userID = req.cookies["user_id"];
  // const user = users[userID];
  // const currentEmail = user.email;
  // let message = null;
  for( let user in database ){
    if(database[user].email === email){
      return database[user]
    }
  }
  return {};
}

module.exports = getUserByEmail;