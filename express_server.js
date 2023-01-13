const express = require('express')
//const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  res.render("urls_new");
});

app.get("/urls/:id", (req, res) =>{
  const shortURL = req.params.id // params help us to pull information from our request, in this case we are requesting the ID from the URL
  const templateVars = { id: shortURL, longURL: urlDatabase[shortURL] }
  res.render("urls_show", templateVars);
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