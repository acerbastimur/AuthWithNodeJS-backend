import IUser from '../Models/IUser.interface';
import HttpStatus from 'http-status-codes';
import * as firebase from 'firebase-admin';

class SignIn {

  checkIfUserVerified(uid: string): Promise<number> {
    return new Promise((resolve, reject) => {

      firebase.database().ref().child("users").child(uid).once('value', user => {
        let isVerified = user.child("isVerified").val()
        if (isVerified) {
          resolve(HttpStatus.OK)
        } else {
          reject(HttpStatus.UNAUTHORIZED)
        }
      }).catch(err => {
        console.log("my error is ", err)
        reject(HttpStatus.FORBIDDEN)
      })
    })
  }

  setLoginTime(uid: string, time: number): Promise<number> {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child("admin").child("loginTimes").update({
        [uid]: time
      }).then(() => {
        resolve(HttpStatus.OK)
      }).catch(() => {
        reject(HttpStatus.NOT_MODIFIED)
      })
    })
  }


}

export default SignIn;