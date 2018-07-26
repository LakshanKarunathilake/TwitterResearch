import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { User } from "../models/User";



export class FireStoreSetup {
    user:User;
    doc_ID: string;

    temp_fire_user:Store_User;

    constructor(private afs:AngularFirestore,user:User){
        this.user = user;
    }

    fire_users_collection: AngularFirestoreCollection<Store_User>;
    fire_users: Store_User[]=[];

    async subscribeThis(){
        
        return await this.getUserDetails();
     }
    
     addTheUser(){
       const id = this.afs.createId();
       this.fire_users_collection.doc(id).set({
         name: this.user.email,
         userID: this.user.userId
       }).then(()=>{
         console.log('**User Created Successfull**');
       })
     }
    
      getUserDetails(){
          return new Promise((resolve,reject)=>{
            this.fire_users_collection = this.afs.collection<Store_User>('UserData',ref => {
                return ref.where('userID','==',this.user.userId);
              })
               this.fire_users_collection.snapshotChanges()
              .subscribe(data=>{
                if(data.length == 0){
                  console.log('No current users');
                  console.log('--Creating a User Document--');
                  this.addTheUser();
                }
                console.log(data);
                data.map(action=>{
                  let temp: Store_User;
                  temp = action.payload.doc.data();        
                  temp.docID = action.payload.doc.id;
                  this.fire_users.push(temp);
                    resolve(temp); 
                   
                })
                               
              })
          })
       
       
     }
    
}