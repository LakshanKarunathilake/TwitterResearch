import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController, AlertController } from 'ionic-angular';
import { User } from '../../models/User';

import { AngularFireAuth} from 'angularfire2/auth';



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

  user = {} as User;

  constructor(private navCtrl: NavController, public navParams: NavParams,private actControl:ActionSheetController,private afAuth:AngularFireAuth
  ,private alertCtrl: AlertController) {
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
    this.navCtrl.push("RegisterPage");
  }
  
  moveToHomePage(){
    this.navCtrl.setRoot("SearchPage");
  }

  async clickLogin(user: User){
    try{
      const result = await  this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password)
      .then(()=>{
        this.alertCtrl.create({
          message : `Login Success <br><br> <img src="assets/imgs/done_icon.png" width="40px" height="40px">`,
          buttons: ['Dismiss'],          
        }).present();        
        this.presentActionSheet();
      });
      console.log(result);
    }catch(e){
      this.alertCtrl.create({
        message : e.message+`<br><br>
        <div align="center"> <img src="assets/imgs/failure_icon.png" weight="50px" height="50px"></div>
       `,
        buttons: ['Dismiss']
      }).present()
      console.error(e);
    }
   
    
  }

}
