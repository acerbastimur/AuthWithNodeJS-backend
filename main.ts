import express from 'express';
import bodyParser from 'body-parser';
import IUser from './Models/IUser.interface';
import BoolConverter from './Utils/BoolConverter';
import SignUp from './Auth/SignUp';
import * as firebase from 'firebase-admin';
import SignIn from './Auth/SignIn';
import HttpStatus from 'http-status-codes';
import Admin from './Auth/Admin';
var serviceAccount = require("./Firebase Utils/FirebaseUtils");



firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://homework-e065e.firebaseio.com"
});

const app: express.Application = express();
var allowCrossDomain = function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);

let urlEncodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlEncodedParser);

app.post('/SaveUserInfoToDatabase', (request, response) => {
  let incomingUser: IUser;
  incomingUser = request.body;
  console.log(incomingUser);
  incomingUser.isVerified = BoolConverter(incomingUser.isVerified.toString());
  let SignUpController = new SignUp();
  SignUpController.saveUserInfoToDatabase(incomingUser).then(res => {
    console.log("Done")
    SignUpController.sendVerificationEmail(incomingUser.uid, incomingUser.email);
    response.sendStatus(res);
  }).catch(err => {
    console.log("None")
    response.sendStatus(err);
  })
})

app.post('/SaveUserLoginTime', (request, response) => {
  let uid: string;
  let time: number;
  uid = request.body.uid;
  time = request.body.time;
  console.log(uid);
  console.log(time);
  let SignInController = new SignIn();
  SignInController.setLoginTime(uid, time).then(res => {
    console.log("Done setting time")
    response.sendStatus(res);
  }).catch(err => {
    console.log("didn't setting time :(")
    response.sendStatus(err);
  })
})


app.get('/CheckIfUserVerifiedUid=*', (request, response) => {
  let uid: string;
  uid = request.params[0];
  console.log(uid);
  let signInController = new SignIn();
  signInController.checkIfUserVerified(uid).then(() => {
    response.sendStatus(HttpStatus.OK)
  }).catch(() => {
    response.sendStatus(HttpStatus.UNAUTHORIZED)
  });
})

app.get('/SetUserAsOnlineUid=*', (request, response) => {
  let uid: string;
  uid = request.params[0];
  console.log(uid);
  let adminController = new Admin();
  adminController.setStateOnline(uid).then(() => {
    response.sendStatus(HttpStatus.OK);

  });
})

app.get('/GetUserVerificationCodeUid=*', (request, response) => {
  let uid: string;
  uid = request.params[0];
  console.log(uid);
  let signUpController = new SignUp();
  signUpController.getUserVerificationCode(uid).then(code => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ code: code }));

  })
})

app.get('/SetUserVerificationStateTrue=*', (request, response) => {
  let uid: string;
  uid = request.params[0];
  console.log(uid);
  let signUpController = new SignUp();
  signUpController.setUserVerificationStateTrue(uid).then(res => {
    response.sendStatus(HttpStatus.OK);
  })
})

app.get('/GetLoginTimes', (request, response) => {

  let adminController = new Admin();
  adminController.getAllUsersLoginTime().then(time => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(time));
  })
})

app.get('/GetOnlineUsers', (request, response) => {

  let adminController = new Admin();
  adminController.getOnlineUsers().then(users => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(users));
  })
})



app.get('/GetAllUsers', (request, response) => {

  let adminController = new Admin();
  adminController.getAllUsers().then(users => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(users));
  })
})


app.get('/', function (req, res) {
  res.sendStatus(HttpStatus.BAD_REQUEST);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});