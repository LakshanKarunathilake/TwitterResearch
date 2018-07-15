import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {AngularFireAuth} from 'angularfire2/auth'
import firebase from 'firebase';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(private fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  authenticate_twitter(){
    alert('Clicked');
    this.fire.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
    .then(res =>{
      console.log('Form-Google---');
      console.log(res);
      this.navCtrl.setRoot('SearchPage');
    });
    
  }

}