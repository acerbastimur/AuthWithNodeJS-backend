import * as firebase from 'firebase-admin';

class Admin {


    getAllUsersLoginTime(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            firebase.database().ref().child("admin").child("loginTimes").once('value', values => {
                console.log(values.val())
                const loginTimes = Object.values(values.val() ? values.val() : {});
                resolve(loginTimes);
            }).catch(err => {
                reject(["ERROR"])
            })
        })
    }

    getOnlineUsers(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            firebase.database().ref().child("admin").child("onlineUsers").once('value', values => {
                console.log(values.val())
                const onlineUsers = Object.values(values.val() ? values.val() : {});
                resolve(onlineUsers);
            }).catch(err => {
                reject(["ERROR"])
            })
        })
    }

    getAllUsers(): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref().child("users").once('value', users => {
                const _users = users.val() ? users.val() : {};
                resolve(_users);
            }).catch(err => {
                reject(["ERROR"])
            })
        })
    }

    setStateOnline(uid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const onlineUsersRef = firebase.database().ref().child("admin").child("onlineUsers")
            onlineUsersRef.update({
                [uid]: Date.now()
            }).then(() => {
                resolve();
            }).catch(() => reject())
        })
    }
}
export default Admin; 