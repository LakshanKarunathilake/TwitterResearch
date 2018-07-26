import { map } from 'rxjs/operators';
import { Fire_Twitter } from './../../models/Frie_Twitter';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/User';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,private alertCtrl:AlertController) {
    this.user_loggedIn=this.navParams.data;
    this.loadSubscribedAccs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSettingsPage');
  }

  loadSubscribedAccs(){
    this.subscriptions_collection = this.afs.collection('UserData').doc(this.user_loggedIn.document_ID).collection('SubscribedAccs');
    this.subscriptions = this.subscriptions_collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
       
        let b = a.payload.doc.data() as Fire_Twitter;
        b.doc_ID = a.payload.doc.id;
        return {...b};
      }))
    );
    
  }
  unsubscribeAcc(doc_ID:string){
    this.subscriptions_collection.doc(doc_ID).delete().then(()=>{
      this.alertCtrl.create({
        message: 'You have successfully unsubscribed from this account',
        buttons : ['dismiss']
      }).present();
    })
  }


    



}
