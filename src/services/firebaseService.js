import {db} from '../database/firebase';

export default class FirebaseDBService {

    async addRedeem(transactionHash, data){
        return db.collection("redeem").doc(transactionHash).set(data)
        .then(() => 
            Promise.resolve({status: 'success'})
        )
        .catch((error) => 
           Promise.reject({status:'error', error})
        );
    }

}