import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailedReport } from './detailedRepoGen';
import { AngularFirestore } from 'angularfire2/firestore';
import { Tweet_Sentiment } from '../../models/SentimentModels/Tweet_Sentiment';
import { Sentiment } from '../../models/SentimentModels/Sentiment';

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

  tweets_observable: Tweet_Sentiment[];

  shownGroup = null;
  subGroup = null;

  paragraph = "test";

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.user_data = navParams.data; 
    this.generateReport();
    
  } 

  generateReport(){
    this.repo_gen.getTweets(this.user_data).then((data)=>{
      let a ;
      a = JSON.parse(JSON.stringify(data));
      // this.tweets_observable.forEach(element => {
      //   this.repo_gen.getReplySentiment({tweet_id:element.doc_id}).then((reply)=>{
      //     element.reply_sentiment = reply
      //   })
      // });   
      this.tweets_observable = a.map(val=>{
        val.description = val.description;
        val.doc_id = val.doc_id;
        val.sentiment = val.sentiment;
        this.repo_gen.getReplySentiment({tweet_id:val.doc_id}).then((re:Sentiment)=>{          
          if(!isNaN(re.sentiment)){
            this.repo_gen.saveAvgs({
              tweet_id:val.doc_id,
              avgs: re
            })
          }
          
          val.reply_sentiment = re;
        })

        return val
      }) 
    })
  }

  
  toggleGroup(group){
    if(this.isGroupShown(group)){
      this.shownGroup = null;
    }else{
      this.shownGroup = group;
    }
  }

  isGroupShown(group){
    return this.shownGroup === group
  }

 toggleSubGroup(group){
    if(this.isSubGroupShown(group)){
      this.subGroup = null;
    }else{
      this.subGroup = group
    }
  }

  isSubGroupShown(group){
    return this.subGroup === group
  }

}
