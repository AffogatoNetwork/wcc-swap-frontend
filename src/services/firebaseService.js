import {firebaseApp} from '../database/firebase';

export default class FirebaseDBService {
    
    async signIn() {
        const authEmail = process.env.REACT_APP_FIREBASE_AUTH_USER;
        const authPassword = process.env.REACT_APP_FIREBASE_AUTH_PASSWORD;
        console.log('--------------- Entra a autenticar ----------');  

        return firebaseApp.auth()
                .signInWithEmailAndPassword(authEmail, authPassword)
                .then(() => 
                    Promise.resolve({status: 'success'})
                )
                .catch((error) =>
                    Promise.reject({status:'error', error})
                );
    }

    async addRedeem(transactionHash, data){
        return firebaseApp.firestore().collection("redeems").doc(transactionHash).set(data)
        .then(() => 
            Promise.resolve({status: 'success'})
        )
        .catch((error) => 
           Promise.reject({status:'error', error})
        );
    }

}