import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TwitterUser } from '../../models/TwitterUsers';
import { User } from '../../models/User';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Fire_Twitter } from '../../models/Frie_Twitter';
import { InsertToFireStore } from './InserToFireStore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tweet } from '../../models/Tweet';



/**
 * Generated class for the TwitterViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
  

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

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,private alertCtrl:AlertController,private http:HttpClient) {
    this.twitter_user = this.navParams.get('acc_data');
    this.user_loggedIn = this.navParams.get('logged_in');
    console.log('docID',this.user_loggedIn.document_ID);
    
  }

  async subscribe(){
    var a =  await this.checkSuitability()
    console.log(a);
    let b = Object.keys(a);
    console.log('b is',b.length);
    
    if(b.length >=0 && b.length<5){
      let exists:boolean = false;
      for (let index = 0; index < b.length; index++) {
        if(a[index].id == this.twitter_user.id_str){
          exists = true
        }
        
      }
      if(!exists){
        this.createTwitterSubscribe();
      }else{
        this.alertCtrl.create({
          message: 'You have already subscribed for this channel',
          buttons: ['dismiss']
        }).present();        
      }
    }else{
      this.alertCtrl.create({
        message: 'You have already subscibed the maximum limit',
        buttons: ['dismiss']
      }).present();      
    } 
    this.navCtrl.pop();

    // Saving Data To the Database

    
  }

  async checkSuitability(){
    return new Promise((resolve,reject)=>{
      this.subscribed_accounts_collection =  this.afs.collection('UserData',ref=>{
        return ref.where('userID','==',this.user_loggedIn.userId)
      }).doc(this.user_loggedIn.document_ID).collection('TwitterSubscriptions')
   
      this.subscribed_accounts_collection.valueChanges()
      .subscribe(data=>{
        console.log(data);              
        this.subscribed_accounts = data;
        resolve(data);        
      })
      
   
    })
  }

  createTwitterSubscribe(){
    
      const subscription_ID = this.afs.createId();
      this.subscribed_accounts_collection.doc(subscription_ID).set({
        id:this.twitter_user.id_str,
        name: this.twitter_user.screen_name
      },{merge:true})
      .then(()=>{
        let insertion = new InsertToFireStore(this.afs,this.http)
        insertion.ObtainData(
          {
            collection: this.subscribed_accounts_collection,
            id: subscription_ID,
            name: this.twitter_user.screen_name
          })
      })
    } 

    
    
    
  
  
}
