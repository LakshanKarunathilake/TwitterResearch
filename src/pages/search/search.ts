import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TwitterUser } from '../../models/TwitterUsers';

import 'rxjs/operator/map'
import { User } from '../../models/User';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  //For the tabs loading purpose
  tab1Root = 'SearchPage';
  tab2Root = 'ReportsPage';
  myIndex: number;
  //For data transfering
  users: Observable<TwitterUser[]>;
  title:string;
  private url = "/api";
  loading:Loading;

  user_loggedIn: User;

	constructor(public navCtrl: NavController, public navParams: NavParams,private http:HttpClient,private _platform:Platform,
		private loadingCtrl:LoadingController,private alertCtrl:AlertController) {
     this.user_loggedIn = this.navParams.data;
     console.log('----Seacrh Page-----');
     console.log(this.user_loggedIn.userId);
 	}


  //  search(input: string){
  //   this.http.get<Observable<TwitterUser[]>>((this.url)+"/twitter_users/"+this.title)
  //   .subscribe(response=>this.posts= response)
  //  }


  searchTwitterProfiles(input: string){

    this.presentLoading();

    if(this._platform.is("cordova")){      
      this.url = "https://slitt-research-final.appspot.com";
    }

    try{
      let api_call = this.url+"/twitter_users/"+this.title;
      console.log('search in',api_call);
      this.http.get<Observable<TwitterUser[]>>(api_call)
      .subscribe(
        data=>{          
          this.users =data;
          this.loading.dismiss();
        },
        error=>{
          this.loading.dismiss();
          this.alertCtrl.create({
            message:  "Your search field doesn't have matching values"+`<br><br>
            <div align="center"> <img src="assets/imgs/failure_icon.png" weight="50px" height="50px"></div>
           `,
            buttons: ['Dismiss']
          }).present()
        });
    }catch(e){
      this.loading.dismiss();
      console.error(e);
    }    
  }

  // createPost(input: HTMLInputElement){
  //   let post:any = {
  //     title : input.value
  //   }
  //   this.http.post(this.url,JSON.stringify(post))
  //   .subscribe(res=>{
  //     post.id = res.json().id;
  //     this.posts.splice(0,0,post);

  //   })
  // }

  viewPage(user: TwitterUser){
    this.navCtrl.push('TwitterViewPage',{acc_data:user,logged_in:this.user_loggedIn});
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait tille loads'
    });
    this.loading.present();
  }

}
