import * as firebase from 'firebase-admin';
import IUser from '../Models/IUser.interface';
import HttpStatus from 'http-status-codes';
import NodeMailer from 'nodemailer';

class SignUp {


    saveUserInfoToDatabase(user: IUser): Promise<number> {
        return new Promise((resolve, reject) => {
            console.log("user is ", user)
            firebase.database().ref().child("users").child(user.uid).set({
                email: user.email,
                name: user.name,
                surname: user.surname,
                isVerified: user.isVerified,
                uid: user.uid,
                signUpDate: Date.now()
            }).then(e => {
                resolve(HttpStatus.CREATED);
            }).catch(err => {
                console.log("my error is ", err)
                reject(HttpStatus.FORBIDDEN)
            })
        })
    }

    sendVerificationEmail(uid: string, mail: string) {
        const verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1));

        var transporter = NodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'homeworkdigitus@gmail.com',
                pass: 'digitusorhan'
            }
        });

        const mailOptions = {
            from: 'homeworkdigitus@gmail.com', // sender address
            to: mail, // list of receivers
            subject: 'Verification', // Subject line
            html: `<p>Your verification code is ${verificationCode} !</p>`// plain text body
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err)
                console.log(err)
            else
                firebase.database().ref().child("users").child(uid).update({
                    verificationCode: verificationCode
                })
        });
    }

    getUserVerificationCode(uid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref().child("users").child(uid).once('value', user => {
                resolve(user.child("verificationCode").val())
            })

        })
    }

    setUserVerificationStateTrue(uid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref().child("users").child(uid).update({
                isVerified: true
            }).then(() => {
                resolve()
            })

        })
    }

}

export default SignUp;