import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './../../models/User';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Fire_Twitter } from '../../models/Frie_Twitter';

/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {

  user_loggedIn: User;

  subscriptions_collection: AngularFirestoreCollection;
  subscriptions: Observable<any[]>;
  subscribes:Fire_Twitter[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.user_loggedIn=this.navParams.data;
    this.loadSubscribedAccs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
  }

  loadSubscribedAccs(){
    this.subscriptions_collection = this.afs.collection('UserData').doc(this.user_loggedIn.document_ID).collection('TwitterSubscriptions');
    this.subscriptions = this.subscriptions_collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
       
        let b = a.payload.doc.data() as Fire_Twitter;
        b.doc_ID = a.payload.doc.id;
        return {...b};
      }))
    );    
  }

  reportsPage(name:string){
    this.navCtrl.push('ReportTabsPage',name);
  }

}
