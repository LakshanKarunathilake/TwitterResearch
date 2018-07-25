import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TwitterUser } from '../../models/TwitterUsers';
import { User } from '../../models/User';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';



/**
 * Generated class for the TwitterViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 interface Fire_Twitter{
   name: string;
   id: string;
 }

  

@IonicPage()
@Component({
  selector: 'page-twitter-view',
  templateUrl: 'twitter-view.html',
})
export class TwitterViewPage {

  twitter_user: TwitterUser;
  user_loggedIn: User;
  
  subscribed_accounts_collection: AngularFirestoreCollection<Fire_Twitter>;
  subscribed_accounts: Fire_Twitter[];  

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.twitter_user = this.navParams.get('acc_data');
    this.user_loggedIn = this.navParams.get('logged_in');
    console.log('docID',this.user_loggedIn.document_ID);
    
  }

  subscribe(){
    

   this.subscribed_accounts_collection =  this.afs.collection('UserData',ref=>{
     return ref.where('userID','==',this.user_loggedIn.userId)
   }).doc(this.user_loggedIn.document_ID).collection('SubscribedAccs',ref=>{
     return ref.where('id','==',this.twitter_user.id_str)
   })

   this.subscribed_accounts_collection.valueChanges()
   .subscribe(data=>{
     console.log(data.length);
     if(data.length > 0 && data.length < 5){
      console.log('Subscribing')
      this.createTwitterSubscribe();
     }
   })
   
    
  }

  createTwitterSubscribe(){
    const id = this.afs.createId();
    this.subscribed_accounts_collection.doc(id).set({
      id:this.twitter_user.id_str,
      name: this.twitter_user.screen_name
    },{merge:true})
    .then(()=>{
      this.navCtrl.pop();
    })
  }

  
  
}
