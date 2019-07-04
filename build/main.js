"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var BoolConverter_1 = __importDefault(require("./Utils/BoolConverter"));
var SignUp_1 = __importDefault(require("./Auth/SignUp"));
var firebase = __importStar(require("firebase-admin"));
var SignIn_1 = __importDefault(require("./Auth/SignIn"));
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var Admin_1 = __importDefault(require("./Auth/Admin"));
var serviceAccount = require("./Firebase Utils/FirebaseUtils");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://homework-e065e.firebaseio.com"
});
var app = express_1.default();
var allowCrossDomain = function (req, res, next) {
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
var urlEncodedParser = body_parser_1.default.urlencoded({ extended: true });
app.use(urlEncodedParser);
app.post('/SaveUserInfoToDatabase', function (request, response) {
    var incomingUser;
    incomingUser = request.body;
    console.log(incomingUser);
    incomingUser.isVerified = BoolConverter_1.default(incomingUser.isVerified.toString());
    var SignUpController = new SignUp_1.default();
    SignUpController.saveUserInfoToDatabase(incomingUser).then(function (res) {
        console.log("Done");
        SignUpController.sendVerificationEmail(incomingUser.uid, incomingUser.email);
        response.sendStatus(res);
    }).catch(function (err) {
        console.log("None");
        response.sendStatus(err);
    });
});
app.post('/SaveUserLoginTime', function (request, response) {
    var uid;
    var time;
    uid = request.body.uid;
    time = request.body.time;
    console.log(uid);
    console.log(time);
    var SignInController = new SignIn_1.default();
    SignInController.setLoginTime(uid, time).then(function (res) {
        console.log("Done setting time");
        response.sendStatus(res);
    }).catch(function (err) {
        console.log("didn't setting time :(");
        response.sendStatus(err);
    });
});
app.get('/CheckIfUserVerifiedUid=*', function (request, response) {
    var uid;
    uid = request.params[0];
    console.log(uid);
    var signInController = new SignIn_1.default();
    signInController.checkIfUserVerified(uid).then(function () {
        response.sendStatus(http_status_codes_1.default.OK);
    }).catch(function () {
        response.sendStatus(http_status_codes_1.default.UNAUTHORIZED);
    });
});
app.get('/SetUserAsOnlineUid=*', function (request, response) {
    var uid;
    uid = request.params[0];
    console.log(uid);
    var adminController = new Admin_1.default();
    adminController.setStateOnline(uid).then(function () {
        response.sendStatus(http_status_codes_1.default.OK);
    });
});
app.get('/GetUserVerificationCodeUid=*', function (request, response) {
    var uid;
    uid = request.params[0];
    console.log(uid);
    var signUpController = new SignUp_1.default();
    signUpController.getUserVerificationCode(uid).then(function (code) {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ code: code }));
    });
});
app.get('/SetUserVerificationStateTrue=*', function (request, response) {
    var uid;
    uid = request.params[0];
    console.log(uid);
    var signUpController = new SignUp_1.default();
    signUpController.setUserVerificationStateTrue(uid).then(function (res) {
        response.sendStatus(http_status_codes_1.default.OK);
    });
});
app.get('/GetLoginTimes', function (request, response) {
    var adminController = new Admin_1.default();
    adminController.getAllUsersLoginTime().then(function (time) {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(time));
    });
});
app.get('/GetOnlineUsers', function (request, response) {
    var adminController = new Admin_1.default();
    adminController.getOnlineUsers().then(function (users) {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(users));
    });
});
app.get('/GetAllUsers', function (request, response) {
    var adminController = new Admin_1.default();
    adminController.getAllUsers().then(function (users) {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(users));
    });
});
app.get('/', function (req, res) {
    res.sendStatus(http_status_codes_1.default.BAD_REQUEST);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
