import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController} from 'ionic-angular';
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
  loading:Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,private faAuth:AngularFireAuth,private alertCtrl:AlertController,private loadingCtrl:LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait while registering..'
    });
  }

  async registerUser(user:User){
    if(this.validatePassword()){
      try{
        this.loading.present();
        const result = await this.faAuth.auth.createUserWithEmailAndPassword(user.email,user.password)
        .then(()=>{
          this.loading.dismiss();
          this.alertCtrl.create({
            message : `Registration Success<br><br> <img src="assets/imgs/done_icon.png" width="40px" height="40px">`,
            buttons: ['Dismiss']
          }).present();
          this.navCtrl.push('LoginPage');
        })
        console.log(result);
      }catch(e){
        this.loading.dismiss();
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

  validatePassword(){
    if(this.user.password == undefined || this.user.confirmPassword == undefined){
      this.alertCtrl.create({
        message: 'You have to fill the password fields'+`
        <br><br>
        <div><img src="assets/imgs/question_icon.png" weight="50px" height="50px"></div>`,
        buttons: ['Dismiss']
      }).present();
      return false;
    }else if(this.user.password != this.user.confirmPassword){
      this.alertCtrl.create({
        message: 'The password filds are not matching'+`
        <br><br>
        <div><img src="assets/imgs/question_icon.png" weight="50px" height="50px"></div>`,
        buttons: ['Dismiss']
      }).present();
      return false;
    }
    return true;
  }

}
