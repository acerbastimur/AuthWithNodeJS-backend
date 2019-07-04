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
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var firebase = __importStar(require("firebase-admin"));
var SignIn = /** @class */ (function () {
    function SignIn() {
    }
    SignIn.prototype.checkIfUserVerified = function (uid) {
        return new Promise(function (resolve, reject) {
            firebase.database().ref().child("users").child(uid).once('value', function (user) {
                var isVerified = user.child("isVerified").val();
                if (isVerified) {
                    resolve(http_status_codes_1.default.OK);
                }
                else {
                    reject(http_status_codes_1.default.UNAUTHORIZED);
                }
            }).catch(function (err) {
                console.log("my error is ", err);
                reject(http_status_codes_1.default.FORBIDDEN);
            });
        });
    };
    SignIn.prototype.setLoginTime = function (uid, time) {
        return new Promise(function (resolve, reject) {
            var _a;
            firebase.database().ref().child("admin").child("loginTimes").update((_a = {},
                _a[uid] = time,
                _a)).then(function () {
                resolve(http_status_codes_1.default.OK);
            }).catch(function () {
                reject(http_status_codes_1.default.NOT_MODIFIED);
            });
        });
    };
    return SignIn;
}());
exports.default = SignIn;
