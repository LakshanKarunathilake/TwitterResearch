import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import {Observable} from 'rxjs/observable' 

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

  items: Observable<any[]>;
  itemsArr = [];
  itemValue;

  constructor(public navCtrl: NavController, public navParams: NavParams,private fdb:AngularFireDatabase) {
    this.items = fdb.list('/items/').snapshotChanges();
    console.log(this.items);
    // this.items.forEach(element => {
    //   console.log(element);
    //   for(let i =0;i<element.length;i++){
    //     this.itemsArr.push({
    //       name:element[i].name
    //     })
    //   }
      
    // })
   
    
  }

 AddToDB(){
   this.fdb.list('items').push(this.itemValue); 
 }

}
