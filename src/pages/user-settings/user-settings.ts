import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/User';
import { Fire_Twitter } from '../../models/Frie_Twitter';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';


/**
 * Generated class for the UserSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsPage {
  
  user_loggedIn: User;

  subscriptions_collection: AngularFirestoreCollection;
  subscriptions: Observable<any[]>;
  subscribes:Fire_Twitter[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.user_loggedIn=this.navParams.data;
    this.loadSubscribedAccs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSettingsPage');
  }

  loadSubscribedAccs(){
    this.subscriptions_collection = this.afs.collection('UserData').doc(this.user_loggedIn.document_ID).collection('SubscribedAccs');
    this.subscriptions = this.subscriptions_collection.valueChanges();
    this.subscriptions.subscribe(data=>{
     this.subscribes = data;
    })
    
  }
  unsubscribeAcc(name:string){
    console.log('clicked....');
    this.subscriptions.subscribe(data=>{
      console.log(data);
      for (let index = 0; index < data.length; index++) {
        console.log('data delete')
        if(data[index].id = name){
          console.log('Caught in the array')
          data.splice(index,1);
        }
        
      }
    })
  }


    



}
