"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = __importStar(require("firebase-admin"));
var Admin = /** @class */ (function () {
    function Admin() {
    }
    Admin.prototype.getAllUsersLoginTime = function () {
        return new Promise(function (resolve, reject) {
            firebase.database().ref().child("admin").child("loginTimes").once('value', function (values) {
                console.log(values.val());
                var loginTimes = Object.values(values.val() ? values.val() : {});
                resolve(loginTimes);
            }).catch(function (err) {
                reject(["ERROR"]);
            });
        });
    };
    Admin.prototype.getOnlineUsers = function () {
        return new Promise(function (resolve, reject) {
            firebase.database().ref().child("admin").child("onlineUsers").once('value', function (values) {
                console.log(values.val());
                var onlineUsers = Object.values(values.val() ? values.val() : {});
                resolve(onlineUsers);
            }).catch(function (err) {
                reject(["ERROR"]);
            });
        });
    };
    Admin.prototype.getAllUsers = function () {
        return new Promise(function (resolve, reject) {
            firebase.database().ref().child("users").once('value', function (users) {
                var _users = users.val() ? users.val() : {};
                resolve(_users);
            }).catch(function (err) {
                reject(["ERROR"]);
            });
        });
    };
    Admin.prototype.setStateOnline = function (uid) {
        return new Promise(function (resolve, reject) {
            var _a;
            var onlineUsersRef = firebase.database().ref().child("admin").child("onlineUsers");
            onlineUsersRef.update((_a = {},
                _a[uid] = Date.now(),
                _a)).then(function () {
                resolve();
            }).catch(function () { return reject(); });
        });
    };
    return Admin;
}());
exports.default = Admin;
