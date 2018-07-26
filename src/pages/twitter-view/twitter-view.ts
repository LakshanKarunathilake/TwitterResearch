import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  subscribed_accounts: Fire_Twitter[]=[];  

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,private alertCtrl:AlertController) {
    this.twitter_user = this.navParams.get('acc_data');
    this.user_loggedIn = this.navParams.get('logged_in');
    console.log('docID',this.user_loggedIn.document_ID);
    
  }

  async subscribe(){
    var a = await this.checkSuitability()
    if(a.length >=0 && a.length<5){
      let exists:boolean = false;
      for (let index = 0; index < a.length; index++) {
        if(a[index].id == this.twitter_user.id_str){
          exists = true
        }
        
      }
      if(!exists){
        this.createTwitterSubscribe();
      }
    }  
  }

  async checkSuitability(){
    return new Promise((resolve,reject)=>{
      this.subscribed_accounts_collection =  this.afs.collection('UserData',ref=>{
        return ref.where('userID','==',this.user_loggedIn.userId)
      }).doc(this.user_loggedIn.document_ID).collection('SubscribedAccs')
   
      this.subscribed_accounts_collection.valueChanges()
      .subscribe(data=>{
        console.log(data);
        if(data.length == 0){
          console.log('Subscribing')
          this.createTwitterSubscribe();
        }        
        this.subscribed_accounts = data;
        resolve(data);        
      })
      
   
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
