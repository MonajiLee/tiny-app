const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
};

const users = { 
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
}

function generateRandomString() {
  return Math.random().toString(16).substring(2, 8)
};

let emailMatch = function findEmailMatch() {
  for (var email in users){
    if (email === req.body.email){
      return true
    }
  }
};


app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/urls', (req, res) => {
  let templateVars = { urls : urlDatabase,
                       username: req.cookies["username"] };
  res.render('urls_index', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls/new', (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new"); 
});

app.get('/urls/:id', (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       username: req.cookies["username"] };
  console.log(req.cookies["username"]);
  res.render("url_shows", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  });


app.get('/register', (req, res) => {
  res.render("register");
});

app.get('/hello', function(req, res){
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post('/urls', (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${random}`);
});

app.post('/urls/:id/update', (req, res) => {
  let id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  let randomId = generateRandomString();

  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Sorry, we cannot find that!');
  } else if (emailMatch) {
    res.status(400).send('Sorry, we already have that e-mail registered.');
  } else {
      key = { id: randomId, 
      email: req.body.email, 
      password: req.body.password };
      res.cookie('user_id', randomId);
  }
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username', req.body);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});