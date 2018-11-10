import { Tweet_Detail } from "./../../models/SentimentModels/Tweet_Detail";
import { LoadingController, Loading } from "ionic-angular";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";

import { Observable } from "rxjs";
import { Sentiment } from "../../models/SentimentModels/Sentiment";

export class DetailedReport {
  loading: Loading;

  constructor(
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController
  ) {
    //this.getAllSentiment();
  }

  subscription_doc: AngularFirestoreDocument;

  tweets_observable: Observable<Tweet_Detail[]>;

  /*Preparing the dataset ready for the visual aid of statistical records*/

  getTweets(data) {
    this.subscription_doc = this.afs
      .collection("UserData")
      .doc(data.user_docID)
      .collection("TwitterSubscriptions")
      .doc(data.twitter_docID);

    return new Promise((resolve, reject) => {
      this.subscription_doc
        .collection("RawData")
        .snapshotChanges()
        .subscribe(val => {
          this.subscription_doc
            .collection("WatsonData")
            .snapshotChanges()
            .subscribe(val2 => {
              let twitter_sentiment: Tweet_Detail[] = [];
              val.forEach(element => {
                let ts: Tweet_Detail = {};
                let sentiment: Sentiment = {};
                val2.forEach(element2 => {
                  if (element.payload.doc.id == element2.payload.doc.id) {
                    ts.description = element.payload.doc.data().full_text;
                    ts.doc_id = element2.payload.doc.id;

                    if (element2.payload.doc.data().emotion != undefined) {
                      sentiment.Anger = element2.payload.doc.data().emotion.Anger;
                      sentiment.Fear = element2.payload.doc.data().emotion.Fear;
                      sentiment.Joy = element2.payload.doc.data().emotion.Joy;
                      sentiment.sentiment = element2.payload.doc.data().sentiment;

                      sentiment.sentiment =
                        Math.round(sentiment.sentiment * 100) / 100;
                      sentiment.Anger = Math.round(sentiment.Anger * 100) / 100;
                      sentiment.Fear = Math.round(sentiment.Fear * 100) / 100;
                      sentiment.Joy = Math.round(sentiment.Joy * 100) / 100;

                      ts.sentiment = sentiment;
                      ts.reply_sentiment = element2.payload.doc.data().AVGS;
                      console.log(
                        "ading emotions to the array called tweet_sentiment"
                      );
                      twitter_sentiment.push(ts);
                    }
                  }
                });
              });
              resolve(twitter_sentiment);
            });
        });
    });
  }

  //  Obtaining the setiment data from the firebase

  getReplySentiment(data) {
    if (data.tweet_id != undefined) {
      return new Promise((res, rej) => {
        let sentiment: Sentiment = {};
        this.subscription_doc
          .collection("WatsonData")
          .doc(data.tweet_id)
          .collection("ReplySentiments")
          .valueChanges()
          .subscribe(val => {
            let average_sentiment: number = 0;
            let average_anger: number = 0;
            let average_joy: number = 0;
            let average_fear: number = 0;

            val.forEach(reply => {
              if (reply != undefined && reply.emotion != undefined) {
                average_sentiment += +reply.sentiment;
                average_anger += +reply.emotion.Anger;
                average_joy += +reply.emotion.Joy;
                average_fear += +reply.emotion.Fear;
              }
            });

            //Averaging sentiment values of replies
            sentiment.sentiment = average_sentiment / val.length;
            sentiment.Anger = average_anger / val.length;
            sentiment.Joy = average_joy / val.length;
            sentiment.Fear = average_fear / val.length;

            //Rounding scores to two Decimal Points

            sentiment.sentiment = Math.round(sentiment.sentiment * 100) / 100;
            sentiment.Anger = Math.round(sentiment.Anger * 100) / 100;
            sentiment.Joy = Math.round(sentiment.Joy * 100) / 100;
            sentiment.Fear = Math.round(sentiment.Fear * 100) / 100;

            res(sentiment);
          });
      });
    }
  }

  saveAvgs(data) {
    return new Promise((resolve, reject) => {
      let a = 0;
      this.subscription_doc
        .collection("WatsonData")
        .doc(data.tweet_id)
        .set({ AVGS: data.avgs }, { merge: true })
        .then(() => {
          a++;

          console.log("Written Avg Data" + a);
        });
    });
  }

  // Generating values for the image Analysis Label

  getImageAnalysisData(doc_id: string) {
    return new Promise((res, rej) => {
      this.subscription_doc
        .collection("VisionAnalysis")
        .doc(doc_id)
        .valueChanges()
        .subscribe(data => {
          let dummy;
          if (data != undefined) {
            dummy = JSON.parse(JSON.stringify(data));
            console.log("Dummy ", dummy);
            res(dummy.labels);
          } else {
            res(undefined);
          }
        });
    });
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait till unsubscribing done"
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }
}
