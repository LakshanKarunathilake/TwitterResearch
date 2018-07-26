import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController, AlertController,Loading,LoadingController } from 'ionic-angular';
import { User } from '../../models/User';

import { AngularFireAuth} from 'angularfire2/auth';
import { FireStoreSetup } from '../../utilities/FirebaseWriting'
import { AngularFirestore } from 'angularfire2/firestore';




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
  loading: Loading;
 

  constructor(private navCtrl: NavController, public navParams: NavParams,private actControl:ActionSheetController,private afAuth:AngularFireAuth
  ,private alertCtrl: AlertController,private loadingCtrl:LoadingController,private afs:AngularFirestore) {
    
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait tille loads'
    });
    this.loading.present();
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
  
  async moveToHomePage(){
    let fs= new FireStoreSetup(this.afs,this.user);
    var val =  await fs.subscribe();
    console.log(val);
    this.user.document_ID = val['docID'];
    this.navCtrl.push("MainMenuPage",this.user);
    
  }

  async clickLogin(user: User){
    this.presentLoading();
    try{
      const result = await  this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password)
      .then((data)=>{
        this.loading.dismiss();   
        this.user.userId = data.user.uid;  
        this.presentActionSheet();
      });
      console.log(result);
    }catch(e){
      this.loading.dismiss();
      
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
