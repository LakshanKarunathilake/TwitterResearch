
import { Loading } from 'ionic-angular/umd';
import { map } from 'rxjs/operators';
import { Fire_Twitter } from './../../models/Frie_Twitter';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
  
  loading:Loading;

  subscriptions_collection: AngularFirestoreCollection;
  subscriptions: Observable<any[]>;
  subscribes:Fire_Twitter[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,private alertCtrl:AlertController,
  private loadingCtrl:LoadingController) {
    this.loadSubscribedAccs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSettingsPage');
  }

  loadSubscribedAccs(){
    let user_id = localStorage.getItem('user_id')
    let user_doc_id = localStorage.getItem('user_doc_id')
    this.subscriptions_collection = this.afs.collection('UserData').doc(user_doc_id).collection('TwitterSubscriptions');
    this.subscriptions = this.subscriptions_collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
       
        let b = a.payload.doc.data() as Fire_Twitter;
        b.doc_ID = a.payload.doc.id;
        return {...b};
      }))
    );
    
  }
  unsubscribeAcc(doc_ID:string){
    this.presentLoading();
    this.subscriptions_collection.doc(doc_ID).delete().then(()=>{
      this.alertCtrl.create({
        message: 'You have successfully unsubscribed from this account',
        buttons : ['dismiss']
      }).present();
      this.hideLoading();
    })
  }
  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait till unsubscribing done'
    });
    this.loading.present();
  }

  hideLoading(){
    this.loading.dismiss();
  }




}
