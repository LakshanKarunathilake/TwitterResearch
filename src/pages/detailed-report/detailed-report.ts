import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailedReport } from './detailedRepoGen';
import { AngularFirestore } from 'angularfire2/firestore';

/**
 * Generated class for the DetailedReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailed-report',
  templateUrl: 'detailed-report.html',
})
export class DetailedReportPage {
  
  user_data;
  repo_gen = new DetailedReport(this.afs);

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.user_data = navParams.data;
    console.log('detailed',this.user_data)
    this.generateReport();
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailedReportPage');
  }

  async generateReport(){
    
    let a
    this.repo_gen.sentimentData(this.user_data)
    .then((bc)=>{
      console.log('bc',bc)
    })
    
    console.log('a is',a)
    
    

    
   
  }

}
