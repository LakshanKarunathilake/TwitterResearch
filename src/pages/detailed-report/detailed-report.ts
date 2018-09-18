import { Tweet_Detail } from "./../../models/SentimentModels/Tweet_Detail";
import { Observable } from "rxjs/Observable";
import { Component ,ViewChild } from "@angular/core";
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

import {Chart } from 'chart.js'

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
  a: Tweet_Detail[] = [];
  user_data;
  repo_gen = new DetailedReport(this.afs, this.loadingCtrl);

  tweets_observable: Observable<Tweet_Detail[]>;

  shownGroup = null;
  desctiptionSentiment = null;
  replySentiment = null;
  barchartData = [];

  emojiiToggle = true;
  emojiis = [];

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

  @ViewChild('BarCanvas') BarCanvas;

  generateReport() {
    this.presentLoading();
    this.repo_gen.getTweets(this.user_data).then(data => {
      console.log("tweets", data);
      let array_of_tweets;
      array_of_tweets = JSON.parse(JSON.stringify(data));

      console.log("array of tweets", array_of_tweets);
      let x = 0;
this.barchartData['datasets'] = [];
this.barchartData['labels'] = [];
this.barchartData['labels'][x]=[];



this.barchartData['datasets']=[];

this.barchartData['datasets'][0]=[];
this.barchartData['datasets'][1]=[];
this.barchartData['datasets'][2]=[];

this.barchartData['datasets'][0]['data']=[]; 
this.barchartData['datasets'][1]['data']=[];
this.barchartData['datasets'][2]['data']=[];

let backgroundColorRed ='rgba(255, 0, 0, 0.3)';
                        
                      let backgroundColorGreen = 'rgba(0, 255, 0, 0.3)';

                      let backgroundColorBlue = 'rgba(0, 0, 255, 0.3)';

this.barchartData['datasets'][0]['backgroundColor'] = [];
this.barchartData['datasets'][1]['backgroundColor'] = [];
this.barchartData['datasets'][2]['backgroundColor'] = [];




      for(let x =0;x<array_of_tweets.length; x++){
        // this.barchartData['labels'][x]=[];
        this.barchartData['labels'][x] = 'Tweet '+(x+1); 


        // this.barchartData['datasets']=[];

        // this.barchartData['datasets'][0]=[];
        // this.barchartData['datasets'][1]=[];
        // this.barchartData['datasets'][2]=[];

        this.barchartData['datasets'][0]['label'] = 'Anger ';
        this.barchartData['datasets'][1]['label'] = 'Fear ';
        this.barchartData['datasets'][2]['label'] = 'Joy ';

        this.barchartData['datasets'][0]['backgroundColor'][x] = [];
        this.barchartData['datasets'][1]['backgroundColor'][x] = [];
        this.barchartData['datasets'][2]['backgroundColor'][x] = [];

        this.barchartData['datasets'][0]['backgroundColor'][x] = backgroundColorRed;
        this.barchartData['datasets'][1]['backgroundColor'][x] = backgroundColorGreen;
        this.barchartData['datasets'][2]['backgroundColor'][x] = backgroundColorBlue;

        // this.barchartData['datasets'][0]=[];
        // this.barchartData['datasets'][1]=[];
        // this.barchartData['datasets'][2]=[];

        // this.barchartData['datasets'][0]['data']=[]; 
        // this.barchartData['datasets'][1]['data']=[];
        // this.barchartData['datasets'][2]['data']=[];

        this.barchartData['datasets'][0]['data'][x]=[];

        this.barchartData['datasets'][0]['data'][x] = array_of_tweets[x].sentiment.Anger; 
        this.barchartData['datasets'][1]['data'][x] = array_of_tweets[x].sentiment.Fear;
        this.barchartData['datasets'][2]['data'][x] = array_of_tweets[x].sentiment.Joy;
        
      }

      console.log("bar chart data",this.barchartData);
      
      this.drawBarChart(this.barchartData);


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

      //console.log(this.tweets_observable);
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

  showEmojii(score: number, type) {
    console.log("score is" + score);
    console.log("type is " + type);

    this.emojiis = [];

    if (this.emojiiToggle == true) {
      this.emojiiToggle = false;
    } else {
      this.emojiiToggle = true;
    }

    // let number_of_emojiss = 2 * Math.round((score * 10) / 2);
    // console.log("After Rounding", number_of_emojiss);

    // for (let index = 0; index < number_of_emojiss; index++) {
    //   switch (type) {
    //     case "Anger":
    //       this.emojiis.push("😡");
    //       break;
    //     case "Joy":
    //       this.emojiis.push("😊");
    //       break;
    //     case "Fear":
    //       this.emojiis.push("😨");
    //       break;
    //     default:
    //       break;
    //   }
    // }
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

  drawBarChart(data){
    var stackedBar = new Chart(this.BarCanvas.nativeElement, {
      type: 'bar',
      data: data,
      options: {
          scales: {
              xAxes: [{
                  stacked: true
              }],
              yAxes: [{
                  stacked: true
              }]
          }
      }
  });

  }
}
