// MIDDLEWARE SET-UP ---------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());


// BUILT-IN MEMORY OBJECTS ---------------------------------------------------
const urlDatabase = {
  "b2xVn2": {
    userID: "userRandomID",
    URL: "http://www.lighthouselabs.ca" },
  "9sm5xK": {
    userId: "user2RandomID",
    URL: "http://www.google.com" }
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
};


// FUNCTIONS & CALLBACKS -----------------------------------------------------
function generateRandomString() {
    return Math.random().toString(16).substring(2, 8);
}

function checkEmailMatch(submittedEmail) {
    for (let userId in users) {
        if (submittedEmail === users[userId].email){
            return true;
        } else {
            return false;
        }
    }
}

function checkPasswordMatch(submittedPassword) {
    for (let userId in users) {
        if (submittedPassword === users[userId].password){
            return true;
        } else {
            return false;
        }
    }
}

function checkUser(idSubmitted) {
    for (let userId in users) {
        if (idSubmitted === users[userId].id) {
            return true;
        } else {
            return false;
        }
    }
}

function checkCreator(idSubmitted) {
    for (let url in urlDatabase) {
        if (idSubmitted === urlDatabase[url].userID) {
            return true;
        } else {
            return false;
        }
    }
}

function urlsForUser(id) {
    let userUrls = {};
    for (let url in urlDatabase) {
        if (id === urlDatabase[url].userID) {
            userUrls[url] = urlDatabase[url]
        }
    }
    return userUrls;
}

// PAGES ---------------------------------------------------------

app.get("/", (req, res) => {
    res.send("Welcome to TinyApp!");
});

app.get("/urls", function(req,res) {
    let templateVars = {
        urls: urlsForUser((req.cookies["user_id"])),
        userObj: users[req.cookies["user_id"]]
    };
    res.render("urls_index", templateVars);
});

app.get("/urls/new", function(req, res) {
    let templateVars = {
        userObj: users[req.cookies["user_id"]]
    };
    res.render("urls_new", templateVars);
    res.redirect("/login")
});

app.get("/urls/:id", function(req, res) {
    let templateVars = {
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id],
        userObj: users[req.cookies["user_id"]]
    };
    if (checkCreator(req.cookies["user_id"])) {
        urlDatabase[req.params.id] = req.body.longURL;
        res.redirect("/urls_show", templateVars);
    } else {
        res.redirect("/login");
    }
});

app.get("/u/:shortURL", function(req, res) {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/login", function(req, res) {
    let templateVars = {
        userObj: users[req.cookies["user_id"]]
     };
    res.render("login", templateVars);
});


app.post("/urls", function(req, res) {
    let uniqueShortURL = generateRandomString();
// adding the new short and long URL to the userDatabase
    urlDatabase[uniqueShortURL] = req.body.longURL;
    res.redirect(`/urls/${uniqueShortURL}`);
});

app.post("/urls/:id/delete", function(req, res) {
    if (checkCreator(req.cookies["user_id"])) {
        delete urlDatabase[req.params.id];
        res.redirect("/urls");
    } else {
        res.redirect("/login");
    }
});

app.post("/urls/:id", function(req, res) {
    if (checkCreator(req.cookies["user_id"])) {
        urlDatabase[req.params.id] = req.body.longURL;
        res.redirect("/urls");
    } else {
        res.send("Please register or login to use TinyApp");
    }
});

app.post("/register", function(req, res) {
    let uniqueUserId = generateRandomString();
    if (req.body.email === "" || req.body.password === "") {
        res.status(400).send("Oops, looks like something is missing! Please include both an email and password.");
    } else if (checkEmailMatch(req.body.email)) {
        res.status(400).send("Invalid");
    } else {
        users[uniqueUserId] = {
            id: uniqueUserId,
            email: req.body.email,
            password: req.body.password
        }
        res.cookie("user_id", uniqueUserId);
        res.redirect("/urls")
    };
});

app.post("/login", function(req, res){
    let user_id = '';
    for (const key in users) {
      if (req.body.email === users[key].email) {
        user_id = key
      }
    };

    if (checkEmailMatch(req.body.email)) {
        if (checkPasswordMatch(req.body.password)) {
            res.cookie("user_id", user_id);
            res.redirect("/");
        } else {
            res.status(403).send("Invalid email and password combination.");
        }
    } else {
        res.status(403).send("Invalid email and password combination.");
    }
});

app.post("/logout", function(req, res){
    res.clearCookie("user_id");
    res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});