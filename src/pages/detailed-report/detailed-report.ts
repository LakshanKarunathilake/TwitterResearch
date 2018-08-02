import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  a:Tweet_Sentiment[] = [];
  user_data;
  repo_gen = new DetailedReport(this.afs);

  tweets_observable: Tweet_Sentiment[];

  shownGroup = null;
  desctiptionSentiment = null;
  replySentiment = null;

  paragraph = "test";


  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,private alertCtrl:AlertController) {
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

          if(re ! = undefined){
            val.reply_sentiment = re;
          }
          

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

  toggleTweetSentiment(group,tweet){
   if(tweet.sentiment != undefined){
    if(this.isTweetSentimentShown(group)){
      this.desctiptionSentiment = null;
    }else{
      this.desctiptionSentiment = group
    }
   }else{
     this.alertCtrl.create({
       message: 'Sorry this Tweet Sentiment Have Neutral Analysis',
       buttons: ['dismiss']
     }).present();
   }
    
  }

  isTweetSentimentShown(group){
    return this.desctiptionSentiment === group
   
  }

  toggleReplySentiment(group,tweet){
    if(tweet.reply_sentiment != undefined){
      if(this.isTweetSentimentShown(group)){
        this.replySentiment = null;
      }else{
        this.replySentiment = group
      }
     }else{
       this.alertCtrl.create({
         message: 'Sorry this Tweet Sentiment Have Negutral Feedback or no replies',
         buttons: ['dismiss']
       }).present();
     }
  }


  isReplySentimentShown(group){
    return this.replySentiment === group
   

  }

}
