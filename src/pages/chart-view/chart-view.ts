import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

import { Chart } from "chart.js";
import { Sentiment } from "../../models/SentimentModels/Sentiment";

/**
 * Generated class for the ChartViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-chart-view",
  templateUrl: "chart-view.html"
})
export class ChartViewPage {
  @ViewChild("TweetCanvas")
  TweetCanvas;

  @ViewChild("ReplyCanvas")
  ReplyCanvas;

  tweet_sentiment: Sentiment;
  reply_sentiment: Sentiment;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController
  ) {
    this.tweet_sentiment = this.navParams.get("tweet");
    this.reply_sentiment = this.navParams.get("reply");
  }

  ionViewDidLoad() {
    this.drawTheCharts();
  }

  closeModal() {
    this.view.dismiss();
  }

  drawTheCharts() {
    new Chart(this.TweetCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Sentiment", "Joy", "Fear", "Anger"],
        datasets: [
          {
            data: [
              this.tweet_sentiment.sentiment,
              this.tweet_sentiment.Joy,
              this.tweet_sentiment.Fear,
              this.tweet_sentiment.Anger
            ],
            backgroundColor: ["#BA68C8", "#00BCD4", "#FF9800", "#FFCCBC"]
          }
        ]
      }
    });
    if (this.reply_sentiment != undefined)
      new Chart(this.ReplyCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: ["Sentiment", "Joy", "Fear", "Anger"],
          xAxisID: "Type",
          yAxisID: "Score",
          borderWidht: 1,
          datasets: [
            {
              scaleOverride: true,
              scaleSteps: 9,
              scaleStartValue: 0,
              scaleStepWidth: 0.2,
              data: [
                this.reply_sentiment.sentiment,
                this.reply_sentiment.Joy,
                this.reply_sentiment.Fear,
                this.reply_sentiment.Anger
              ],
              backgroundColor: ["#BA68C8", "#00BCD4", "#FF9800", "#FFCCBC"]
            }
          ]
        }
      });
  }

  isReplyUndefined() {
    if (this.reply_sentiment === undefined) {
      return true;
    } else {
      return false;
    }
  }
}
