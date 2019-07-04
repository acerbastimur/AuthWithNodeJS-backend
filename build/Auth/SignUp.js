"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = __importStar(require("firebase-admin"));
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var SignUp = /** @class */ (function () {
    function SignUp() {
    }
    SignUp.prototype.saveUserInfoToDatabase = function (user) {
        return new Promise(function (resolve, reject) {
            console.log("user is ", user);
            firebase.database().ref().child("users").child(user.uid).set({
                email: user.email,
                name: user.name,
                surname: user.surname,
                isVerified: user.isVerified,
                uid: user.uid,
                signUpDate: Date.now()
            }).then(function (e) {
                resolve(http_status_codes_1.default.CREATED);
            }).catch(function (err) {
                console.log("my error is ", err);
                reject(http_status_codes_1.default.FORBIDDEN);
            });
        });
    };
    SignUp.prototype.sendVerificationEmail = function (uid, mail) {
        var verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1));
        var transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'homeworkdigitus@gmail.com',
                pass: 'digitusorhan'
            }
        });
        var mailOptions = {
            from: 'homeworkdigitus@gmail.com',
            to: mail,
            subject: 'Verification',
            html: "<p>Your verification code is " + verificationCode + " !</p>" // plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err);
            else
                firebase.database().ref().child("users").child(uid).update({
                    verificationCode: verificationCode
                });
        });
    };
    SignUp.prototype.getUserVerificationCode = function (uid) {
        return new Promise(function (resolve, reject) {
            firebase.database().ref().child("users").child(uid).once('value', function (user) {
                resolve(user.child("verificationCode").val());
            });
        });
    };
    SignUp.prototype.setUserVerificationStateTrue = function (uid) {
        return new Promise(function (resolve, reject) {
            firebase.database().ref().child("users").child(uid).update({
                isVerified: true
            }).then(function () {
                resolve();
            });
        });
    };
    return SignUp;
}());
exports.default = SignUp;
