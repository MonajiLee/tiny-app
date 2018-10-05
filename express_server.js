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

function findEmailMatch(emailSubmitted) {
  for (var key in users){
    if (users[key].email === emailSubmitted){
     return true;
   }
  }
  return false;
};

function findPasswordMatch(passwordSubmitted) {
  for (var key in users){
    if (users[key].password === passwordSubmitted){
     return true;
    }
  }
  return false;
};

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/urls', (req, res) => {
  //no need for this.
  //let randomId = generateRandomString();
  // let templateVars = { urls : urlDatabase,
  //                      userObj: req.cookies("user_id", users[randomId]) };
  let templateVars = { 
        urls : urlDatabase,
        userObj: users[req.cookies["user_id"]],  //you are storing the whole user object in //userObj
        userCookie: req.cookies["user_id"]
  };
  console.log(users);
  res.render('urls_index', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls/new', (req, res) => {
  let randomId = generateRandomString();
  let templateVars = { userObj: users[req.cookies["user_id"]],
                       userCookie: req.cookies["user_id"] };
  res.render("urls_new"); 
});

app.get('/urls/:id', (req, res) => {
  let randomId = generateRandomString();
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       userObj: users[req.cookies["user_id"]] };
  res.render("url_shows", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  });


app.get('/register', (req, res) => {
  res.render("register");
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/login', (req, res) => {
  let randomId = generateRandomString();
  let templateVars = {
    userObj: users[req.cookies["user_id"]],
    userCookie: req.cookies["user_id"] };
  res.render("login");
});

app.post('/urls', (req, res) => {
  urlDatabase[randomId] = req.body.longURL;
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
  let isMatch = findEmailMatch(req.body.email);
    if (req.body.email === "" || req.body.password === "") {
      res.status(400).send('Sorry, we cannot find that!');
    } else if (isMatch) {
      res.status(400).send('Sorry, we already have that e-mail registered.');
    } else {
      users[randomId] = { id: randomId, 
      email: req.body.email, 
      password: req.body.password };
      //don't need to store the whole object in the cookie
      //What you need to store is only userId
      //res.cookies('user_id', users[randomId]);
      res.cookie('user_id', randomId);
      res.redirect('/urls');
    }
});

app.post('/login', (req, res) => {
  let user_id = '';
  for (const key in users) {
    if (req.body.email === users[key].email) {
      user_id = key
    }
  };

  let isEmailMatch = findEmailMatch(req.body.email);
  let isPasswordMatch = findPasswordMatch(req.body.password);
  if (isEmailMatch) {
    if (isPasswordMatch){
      res.cookie('user_id', user_id);
      res.redirect('/');
    } else {
      res.status(403).send('Error 400: Forbidden.')
    }
  } else {
    res.status(403).send('Error 400: Forbidden.');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});