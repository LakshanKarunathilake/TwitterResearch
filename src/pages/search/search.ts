import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
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
  tab1Root = 'SearchPage';
  tab2Root = 'ReportsPage';
  myIndex: number;

  posts: any;

  private url = '/api';

  constructor(public navCtrl: NavController, public navParams: NavParams,private http:HttpClient) {
    
    // http.get(this.url)
    // .subscribe(response => {
    //   this.posts = response.json();      
    // });

  }

  searchTwitterProfiles(input: string){
    // let val:string = JSON.stringify(input);
    this.posts = this.http.get((this.url)+"/twitter_users/"+input);
    console.log(this.posts);
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

}
