import { Tweet_Detail } from "./../../models/SentimentModels/Tweet_Detail";
import { Observable } from "rxjs/Observable";
import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Loading,
  LoadingController,
  ModalController
} from "ionic-angular";
import { DetailedReport } from "./detailedRepoGen";
import { AngularFirestore } from "angularfire2/firestore";

import { Chart } from "chart.js";

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
  //For the Overall Chart
  barchartData = [];

  //For Vision Visualization
  visionLabels;

  sentimentAnalysisClicked = false;

  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    this.user_data = navParams.data;

    this.generateReport();
  }

  @ViewChild("BarCanvas")
  BarCanvas;

  @ViewChild("SentimentCanvas")
  SentimentCanvas;

  generateReport() {
    this.presentLoading();
    this.repo_gen.getTweets(this.user_data).then(data => {
      console.log("tweets", data);
      let array_of_tweets;
      array_of_tweets = JSON.parse(JSON.stringify(data));
      console.log("Array of Tweets", array_of_tweets);

      let x = 0;
      this.barchartData["datasets"] = [];
      this.barchartData["labels"] = [];
      this.barchartData["labels"][x] = [];

      this.barchartData["datasets"] = [];

      this.barchartData["datasets"][0] = [];
      this.barchartData["datasets"][1] = [];
      this.barchartData["datasets"][2] = [];

      this.barchartData["datasets"][0]["data"] = [];
      this.barchartData["datasets"][1]["data"] = [];
      this.barchartData["datasets"][2]["data"] = [];

      let backgroundColorRed = "rgba(255, 0, 0, 0.3)";

      let backgroundColorGreen = "rgba(0, 255, 0, 0.3)";

      let backgroundColorBlue = "rgba(0, 0, 255, 0.3)";

      this.barchartData["datasets"][0]["backgroundColor"] = [];
      this.barchartData["datasets"][1]["backgroundColor"] = [];
      this.barchartData["datasets"][2]["backgroundColor"] = [];

      for (let x = 0; x < array_of_tweets.length; x++) {
        this.barchartData["labels"][x] = "Tweet " + (x + 1);

        this.barchartData["datasets"][0]["label"] = "Anger ";
        this.barchartData["datasets"][1]["label"] = "Fear ";
        this.barchartData["datasets"][2]["label"] = "Joy ";

        this.barchartData["datasets"][0]["backgroundColor"][x] = [];
        this.barchartData["datasets"][1]["backgroundColor"][x] = [];
        this.barchartData["datasets"][2]["backgroundColor"][x] = [];

        this.barchartData["datasets"][0]["backgroundColor"][
          x
        ] = backgroundColorRed;
        this.barchartData["datasets"][1]["backgroundColor"][
          x
        ] = backgroundColorGreen;
        this.barchartData["datasets"][2]["backgroundColor"][
          x
        ] = backgroundColorBlue;

        this.barchartData["datasets"][0]["data"][x] = [];

        this.barchartData["datasets"][0]["data"][x] =
          array_of_tweets[x].sentiment.Anger;
        this.barchartData["datasets"][1]["data"][x] =
          array_of_tweets[x].sentiment.Fear;
        this.barchartData["datasets"][2]["data"][x] =
          array_of_tweets[x].sentiment.Joy;
      }

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

  toggleReplySentiment(group2, tweet) {
    if (tweet.reply_sentiment != undefined) {
      if (this.isTweetSentimentShown(group2)) {
        this.replySentiment = null;
      } else {
        this.replySentiment = group2;
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

  isReplySentimentShown(group2) {
    return this.replySentiment === group2;
  }

  sentimentAnalysisToggle() {
    if (this.sentimentAnalysisClicked == true) {
      this.sentimentAnalysisClicked = false;
    } else {
      this.sentimentAnalysisClicked = true;
    }
  }

  viewVisionLabels(doc_id: string) {
    this.presentLoading();
    
    this.repo_gen.getImageAnalysisData(doc_id).then(response => {
      this.hideLoading();
      if (response === undefined) {
        const alert = this.alertCtrl.create({
          title: "No Images",
          message: "Sorry This Tweet does not contain any imagaries",
          buttons: ["OK"]
        });
        alert.present();
      } else {
        let res_array = JSON.parse(JSON.stringify(response));
        const alert = this.alertCtrl.create({
          title: "The images conatains",
          subTitle: res_array.map(icon => {
            return `<i>${icon}</i>`;
          }),
          buttons: ["OK"]
        });
        alert.present();
      }
    });
  }

  chartView(i) {
    console.log("click");
    let tweet_sentiment;
    let reply_sentiment;
    // this.tweets_observable.subscribe(data => {
    //   tweet_sentiment = data[i].sentiment;
    //   reply_sentiment = data[i].reply_sentiment;
    //   const myModal = this.modalCtrl.create("ChartViewPage", {
    //     tweet: tweet_sentiment,
    //     reply: reply_sentiment
    //   });
    //   myModal.present();
    // });

    tweet_sentiment = this.tweets_observable[i].sentiment;
    reply_sentiment = this.tweets_observable[i].reply_sentiment;
    console.log("tweet_sentimet", tweet_sentiment);
    console.log("reply_sentimet", reply_sentiment);
    const myModal = this.modalCtrl.create("ChartViewPage", {
      tweet: tweet_sentiment,
      reply: reply_sentiment
    });
    myModal.present();
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

  drawBarChart(data) {
    new Chart(this.BarCanvas.nativeElement, {
      type: "bar",
      data: data,
      options: {
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    });
  }
}
