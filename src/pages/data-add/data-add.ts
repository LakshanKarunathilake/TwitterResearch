import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs'

/**
 * Generated class for the DataAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-add',
  templateUrl: 'data-add.html',
})
export class DataAddPage {

  items: Observable<any>;
  itemsArr = [];
  itemValue;

  constructor(public navCtrl: NavController, public navParams: NavParams,private fdb:AngularFireDatabase) {
    this.items = fdb.object('items').valueChanges();
    
    this.items.subscribe(res=>{
       this.itemsArr = res.name;
      // this.itemsArr.push(res);
      // console.log(this.itemsArr);
      // console.log(this.itemsArr.length);
    })
   
    
  }

 AddToDB(){
   this.fdb.list('items').push(this.itemValue); 
 }

}
