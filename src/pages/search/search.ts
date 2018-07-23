import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TwitterUser } from '../../models/TwitterUsers';

import 'rxjs/operator/map'
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
  private url = '/api';
  loading:Loading;

	constructor(public navCtrl: NavController, public navParams: NavParams,private http:HttpClient,private _platform:Platform,
		private loadingCtrl:LoadingController,private alertCtrl:AlertController) {
		this.loading=this.loadingCtrl.create({
			content: 'Please wait while twitter sends the requested pages'
		})    
 	}


  //  search(input: string){
  //   this.http.get<Observable<TwitterUser[]>>((this.url)+"/twitter_users/"+this.title)
  //   .subscribe(response=>this.posts= response)
  //  }


  searchTwitterProfiles(input: string){

    this.presentLoading();

    if(this._platform.is("cordova")){      
      this.url = "https://slitt-research-se.appspot.com";
    }

    try{
      
      this.http.get<Observable<TwitterUser[]>>((this.url)+"/twitter_users/"+this.title)
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
    this.navCtrl.push('TwitterViewPage',user);
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait tille loads'
    });
    this.loading.present();
  }

}
