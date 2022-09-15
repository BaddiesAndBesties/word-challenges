require("../database/mongoose"); // mongoose.js
require("dotenv").config();
const express = require("express");
const https = require("https");
const path = require("path");
const bodyParser = require("body-parser");
const jwtDecoder = require("./jwt");
const { addUser, getCurrentWord } = require("../database/mongoose");
const { response } = require("express");
const { User } = require("../database/models");
const { log } = require("console");

// import {parse, stringify, toJSON, fromJSON} from 'flatted';
// CJS
// const {parse, stringify, toJSON, fromJSON} = require('flatted');

const port = process.env.PORT || 8080;
const publicDir = path.join(__dirname, "..", "client", "public", "/");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

// google Routers
app.get("/google-client", (req, res) => {
  console.log("Google Client ID requested");
  res.status(200);
  res.send(process.env.GOOGLE_CLIENT_ID);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir + "index.html"));
});

app.post("/user-info", async (req, res) => {
  const { jwtToken } = req.body;
  const { given_name, family_name, email, picture } = jwtDecoder(jwtToken);

  if (!given_name || !family_name || !email) {
    res.status(500);
    res.send("Invalid User");
  }
  const randomWordUrl = "https://random-word-api.herokuapp.com/word";
  const word = https
    .get(randomWordUrl, (res) => {
      let data = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => {
        const response = JSON.parse(Buffer.concat(data).toString());
        getCurrentWord(word);
        return response[0];
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  try{
  res.status(200);
  res.send(
    JSON.stringify({
      //^^^ giving the following error:
      //typeerror-converting-circular-structure-to-json
      firstname: given_name,
      picture: picture,
      email: email,

      // id: mongoId,// Maybe return MongoDB ID to use as unique ID
    })
  );
  }catch(err){
      res.status(500);
    console.log(err);
  }

  const EmailIfAlreadyInDB = User.find({ email: `${email}` })
  .lean()
  .limit(1);
EmailIfAlreadyInDB.exec(function (err, result) {
  if (!result.length) {
    addUser(given_name, family_name, email, picture, word);
  }
});
  // }).then(msg=>{
  // console.log("WORD ISSSS", (JSON.stringify(word)));
  // })
  // .catch((error) => {
  // res.status(500);
  // res.send("DB Error");
  // Cannot set headers after they are sent to the client
  // console.log("Adding new user to database - FAILED");
  // console.error(error);

  // });
  // });
});
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

//submit user info to db once user logs in
// app.post("/userLoggedIn", {

//Submit button
// app.post("/submitGuess", (req, res) =>{
//   try {
//     //get user's word
//     console.log("user input isssss", req.body.userInput)
//     if (req.body.userInput.length === 1 || req.body.userInput === currentWord) {
//          LOGIC FOR PROCESSING USER INPUT HERE
//     } else {
//       console.log("sorry, wrong char");
//     }
//   } catch (err) {
//     console.log(err);
//   }

// });

//use socket.io to grab word
