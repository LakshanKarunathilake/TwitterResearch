import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/User';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams,private faAuth:AngularFireAuth,private alertCtrl:AlertController) {
  }

  async registerUser(user:User){
    try{
      const result = await this.faAuth.auth.createUserWithEmailAndPassword(user.email,user.password)
      .then(()=>{
        this.alertCtrl.create({
          message : `Registration Success<br><br> <img src="assets/imgs/done_icon.png" width="40px" height="40px">`,
          buttons: ['Dismiss']
        }).present();
      })
      console.log(result);
    }catch(e){
      this.alertCtrl.create({
        message : e.message+`
                <br><br>
                <div><img src="assets/imgs/failure_icon.png" weight="50px" height="50px"></div>
                `,
        buttons: ['Dismiss']
      }).present()
      console.error(e);
    }
    
  }

}
