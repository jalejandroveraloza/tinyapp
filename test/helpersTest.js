const { assert } = require('chai');

const getUserByEmail = require('../helper');
console.log(getUserByEmail)
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.deepEqual(user.id, expectedUserID, "are the same emails")
  });

  it('should return a undefined because the email is not in the database', function() {
    const user = getUserByEmail("user3@example.com", testUsers)
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.deepEqual(user.id, expectedUserID, "email is not in the database")
  });
});