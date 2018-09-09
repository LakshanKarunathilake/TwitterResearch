import { Observable } from "rxjs/Observable";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Loading,
  LoadingController
} from "ionic-angular";
import { DetailedReport } from "./detailedRepoGen";
import { AngularFirestore } from "angularfire2/firestore";
import { Tweet_Sentiment } from "../../models/SentimentModels/Tweet_Sentiment";

import { Sentiment } from "../../models/SentimentModels/Sentiment";

/**
 * Generated class for the DetailedReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-detailed-report",
  templateUrl: "detailed-report.html"
})
export class DetailedReportPage {
  a: Tweet_Sentiment[] = [];
  user_data;
  repo_gen = new DetailedReport(this.afs, this.loadingCtrl);

  tweets_observable: Observable<Tweet_Sentiment[]>;

  shownGroup = null;
  desctiptionSentiment = null;
  replySentiment = null;

  emojiiToggle = false;

  sentimentAnalysisClicked = false;

  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.user_data = navParams.data;

    this.generateReport();
  }

  generateReport() {
    this.presentLoading();
    this.repo_gen.getTweets(this.user_data).then(data => {
      let array_of_tweets;
      array_of_tweets = JSON.parse(JSON.stringify(data));

      console.log("array of tweets", array_of_tweets);
      this.tweets_observable = array_of_tweets.map(val => {
        val.description = val.description;
        val.doc_id = val.doc_id;
        val.sentiment = val.sentiment;

        this.repo_gen
          .getReplySentiment({ tweet_id: val.doc_id })
          .then((re: Sentiment) => {
            if (!isNaN(re.sentiment)) {
              this.repo_gen.saveAvgs({
                tweet_id: val.doc_id,
                avgs: re
              });
            }

            if ((re! = undefined)) {
              val.reply_sentiment = re;
            }
          });

        return val;
      });
    });
    this.hideLoading();
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  toggleTweetSentiment(group, tweet) {
    if (tweet.sentiment != undefined) {
      if (this.isTweetSentimentShown(group)) {
        this.desctiptionSentiment = null;
      } else {
        this.desctiptionSentiment = group;
      }
    } else {
      this.alertCtrl
        .create({
          message: "Sorry this Tweet Sentiment Have Neutral Analysis",
          buttons: ["dismiss"]
        })
        .present();
    }
  }

  isTweetSentimentShown(group) {
    return this.desctiptionSentiment === group;
  }

  toggleReplySentiment(group, tweet) {
    if (tweet.reply_sentiment != undefined) {
      if (this.isTweetSentimentShown(group)) {
        this.replySentiment = null;
      } else {
        this.replySentiment = group;
      }
    } else {
      this.alertCtrl
        .create({
          message:
            "Sorry this Tweet Sentiment Have Negutral Feedback or no replies",
          buttons: ["dismiss"]
        })
        .present();
    }
  }

  isReplySentimentShown(group) {
    return this.replySentiment === group;
  }

  sentimentAnalysisToggle() {
    if (this.sentimentAnalysisClicked == true) {
      this.sentimentAnalysisClicked = false;
    } else {
      this.sentimentAnalysisClicked = true;
    }
  }

  showEmojii(score, type) {
    console.log("score is" + score);
    console.log("type is " + type);

    
  }

  
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait till Data Loads"
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }
}
