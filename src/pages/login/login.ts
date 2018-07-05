import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private navCtrl: NavController, public navParams: NavParams,private actControl:ActionSheetController) {
  }
  

  presentActionSheet() {
    let actionSheet = this.actControl.create({
      title: 'Do you want to keep logged in',
      buttons: [
        {
          text: 'Yes',          
          handler: () => {
            this.moveToHomePage();
          }
        },{
          text: 'No',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  moveToSignupPage(){
    this.navCtrl.push("SignupPage");
  }
  
  moveToHomePage(){
    this.navCtrl.push("HomePage");
  }

  clickLogin(){
    this.presentActionSheet();
  }

}
