const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  return Math.random().toString(16).substring(2, 8)
};


app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/urls', (req, res) => {
  let templateVars = { urls : urlDatabase };
  // MAGIC KEYWORD     ^key   ^key:value pairs of object defined above
  res.render('urls_index', templateVars);        // renders a view (/views/<>.ejs) with                                                          templateVars
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);                         // sends parameter converted into .JSON string
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");                        // renders a view (/views/<>.ejs) 
});

app.get('/urls/:id', (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id] };
  res.render("url_shows", templateVars);        // renders a view (/views/<>.ejs) with                                                          templateVars
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);                      // redirects the specified URL path w/ status                                                 code
  });

app.get('/hello', function(req, res){
  res.send("<html><body>Hello <b>World</b></body></html>\n");     // sends HTTP response
});

app.post("/urls", (req, res) => {
  console.log(req.params);
  var random = generateRandomString();
  urlDatabase[random] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${random}`);    // redirects the specified URL path                                                             w/ status code
});

app.listen(PORT, () => {                        // starts a UNIX socket and listens for                                                           connections on the given path
  console.log(`Example app listening on port ${PORT}!`);
});