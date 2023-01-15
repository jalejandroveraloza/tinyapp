const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

//Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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
//user database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },

}

const urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const userID = req.cookies["user_id"];
  const user = users[userID];

  const templateVars = {
    username: user.email,
    urls: urlDatabase,
    user
  }
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];

  const templateVars = {
    username: user.email,
  }

  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) =>{
  const shortURL = req.params.id // params help us to pull information from our request, in this case we are requesting the ID from the URL
  const userID = req.cookies["user_id"];
  const user = users[userID];

  const templateVars = { 
    username: user.email,
    id: shortURL, longURL: urlDatabase[shortURL] 
  }
  res.render("urls_show", templateVars);
})

app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];

  const templateVars = { 
    username: undefined
  }
  res.render("urls_register", templateVars)
})

app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];

  const templateVars = { 
    username: undefined
  }
  res.render("urls_login", templateVars)
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
    password
  };
  res.cookie("user_id",userID)
  console.log(users)
  res.redirect('/urls');
})

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const newShortId = generateRandomString(6);
  urlDatabase[newShortId] = longURL;
  res.redirect(`/urls/${newShortId}`);
  //console.log(longURL)//Log the POST request body to the console
  //res.send("Ok"); //Respong with ok
})

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  //console.log(longURL)
  res.redirect(longURL);
});

app.post("/urls/:id", (req, res) =>{
  const shortURL = req.params.id
  const newlongURL = req.body.updatedURL

  urlDatabase[shortURL] = newlongURL;

  res.redirect('/urls')

})

app.post("/urls/:id/delete",(req, res) =>{
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
})

app.post("/login", (req, res) =>{
  const user =userLookup(req.body.email)
  if (req.body.email === user.email){
    res.cookie("user_id", user.id);
  }
//res.cookie('username', req.body.username)
res.redirect("/urls");


})

app.post("/logout", (req, res)=>{
  res.clearCookie("user_id");
  res.redirect('/register');
  
})