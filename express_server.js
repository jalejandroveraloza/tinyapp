const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
//const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

//Middlewares
app.use(morgan('dev'));
//app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ["a quick yellow chicken", "jumps over the lazy dog"]
}))

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

//generateRandomString(6)
function generateRandomString(string_length) {
let randomString = "";
let characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
for(let i = 0; i < string_length; i++){
  randomString += characters.charAt(Math.floor(Math.random() * characters.length))
}
return randomString
}

const userLookup = (email) => {
  // const userID = req.cookies["user_id"];
  // const user = users[userID];
  // const currentEmail = user.email;
  // let message = null;
  for( let user in users ){
    if(users[user].email === email){
      return users[user]
    }
  }
  return {};
}

const urlsForUserid = (id) =>{
  //const newShortId = generateRandomString(6);
  const userUrls = {};
  for(let urlID in urlDatabase){
    if(urlDatabase[urlID].userID === id){
      userUrls[urlID] = urlDatabase[urlID]
    }
    console.log(userUrls)
  } return userUrls
}
//user database

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10) , //"purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),//"dishwasher-funk"
  },

}

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
/*const urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};*/

app.get('/',(req, res) =>{

  res.send('Hello!')
});

app.listen(PORT, () =>{
  console.log(`Example app listening on port ${PORT}!`)
})

app.get('/urls.json', (req, res) =>{
  res.json(urlDatabase);
})

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.get("/urls", (req, res) => {
  const userID = req.session.user_id//req.cookies["user_id"];
  const user = users[userID];

  if(userID){
  const templateVars = {
    useremail: user.email,
    urls: urlsForUserid(userID),
    user
  }
  
  res.render("urls_index", templateVars);
} else {
  return res.sendStatus(401)
}
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id//req.cookies["user_id"];
  const user = users[userID];
  if(userID){

    const templateVars = {
      useremail: user.email,
    }
  
    res.render("urls_new", templateVars);
  } else{
    res.redirect("/login");
  }

  
});

app.get("/urls/:id", (req, res) =>{
  const shortURL = req.params.id // params help us to pull information from our request, in this case we are requesting the ID from the URL
  const userID = req.session.user_id//req.cookies["user_id"];
  const user = users[userID];
  if(userID){
  if(!urlDatabase[shortURL]){
    //console.log(urlDatabase[shortURL])
    
   return res.sendStatus(404)

  }

  const templateVars = { 
    useremail: user.email,
    id: shortURL, longURL: urlDatabase[shortURL].longURL// line changed because the database changed, done!!!
  }
  res.render("urls_show", templateVars);
} else {
  return res.sendStatus(401)
}
})

app.get("/register", (req, res) => {
  const userID = req.session.user_id//req.cookies["user_id"];
  const user = users[userID];

  if(userID){
    res.redirect("/urls")
  } else{

  const templateVars = { 
    useremail: undefined
  }
  res.render("urls_register", templateVars)
}
})

app.get("/login", (req, res) => {
  const userID = req.session.user_id//req.cookies["user_id"];
  const user = users[userID];
  if(userID){
    res.redirect("/urls")
  } else{

  const templateVars = { 
    useremail: undefined
  }
  res.render("urls_login", templateVars)
}
})



app.post("/register", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString(6)
  

  if (email === ""|| password === ""){
    return res.sendStatus(400)
    
  } else if (email === userLookup(email).email){
    return res.sendStatus(400)
  }

  users[userID] = {
    id : userID,
    email,
    password: bcrypt.hashSync(password, salt)
  };
  req.session.user_id = userID; //res.cookie("user_id",userID)
  console.log(users)
  res.redirect('/urls');
})

app.post("/urls", (req, res) => {
  const userID = req.session.user_id//req.cookies["user_id"]
  const longURL = req.body.longURL
  const newShortId = generateRandomString(6);

  if(!userID){
   return res.status(400).send("you need to register or login")

  }

  //urlDatabase[newShortId].longURL = longURL; // line changed because the database changed, done
  urlDatabase[newShortId] = {
    longURL,
    userID: userID
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${newShortId}`);
  //console.log(longURL)//Log the POST request body to the console
  //res.send("Ok"); //Respong with ok
})

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL; // line changed because the database changed, done
  //console.log(longURL)
  res.redirect(longURL);
});

app.post("/urls/:id", (req, res) =>{
  const userID = req.session.user_id//req.cookies["user_id"];
  const shortURL = req.params.id
  const newlongURL = req.body.updatedURL

  if(userID){
  urlDatabase[shortURL].longURL = newlongURL; // line changed because the database changed, done

  res.redirect('/urls')
  } else {
    return res.sendStatus(401)
  }

})

app.post("/urls/:id/delete",(req, res) =>{
  const userID = req.session.user_id //req.cookies["user_id"];
  const shortURL = req.params.id;
  if(userID){
  delete urlDatabase[shortURL];
  res.redirect("/urls")
  } else {
    return res.sendStatus(401)
  }
})

app.post("/login", (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  const user =userLookup(req.body.email)

  if (email === user.email && bcrypt.compareSync(password, user.password)){
    req.session.user_id = user.id;//res.cookie("user_id", user.id);
  } else {
    return res.sendStatus(403)
  }
//res.cookie('username', req.body.username)
res.redirect("/urls");


})

app.post("/logout", (req, res)=>{
  req.session = null //res.clearCookie("user_id");
  res.redirect('/login');
  
})