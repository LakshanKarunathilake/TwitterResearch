import { Platform } from "ionic-angular";
import { AngularFirestore } from "angularfire2/firestore";

import { HttpClient } from "@angular/common/http";
import { Tweet } from "../../models/Tweet";
import { Observable } from "rxjs";
import { Tweet_Reply } from "../../models/Tweet_Reply";
import { AnalysisToDB } from "../../utilities/AnalysisToDB/AnalysisToDB";

export class InsertToFireStore {
  private url = "/api";
  Tweets: Observable<Tweet[]>;
  analysis = new AnalysisToDB(this.http, this.afs, this._platform);

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient,
    private _platform: Platform
  ) {
    if (this._platform.is("cordova")) {
      // this.url = "https://slitt-research.appspot.com";
      this.url = localStorage.getItem("api_call");
    }
  }

  async ObtainData(data) {
    //Getting the tweets relavant to the name that user account user subscribed
    let searchurl = this.url + "/get_tweet/" + data.name;

    await this.http.get<Observable<Tweet[]>>(searchurl).subscribe(a => {
      let b = JSON.parse(JSON.stringify(a));
      let index = 0;
      for (index = 0; index < b.length; index++) {
        const element = a[index];
        this.saveToCollection({
          tweet: element,
          collection: data.collection,
          subscription_id: data.id,
          subscription_name: data.name
        });
      }
    });
  }

  async saveToCollection(data) {
    const id = this.afs.createId();

    if (data.tweet.img_url != undefined) {
      this.analysis.callToVisionAPI({
        img_url: data.tweet.img_url,
        // tweet_id: data.subscription_id,
        tweet_id: id,
        collection: data.collection
      });
    }

    await data.collection
      .doc(data.subscription_id)
      .collection("RawData")
      .doc(id)
      .set(data.tweet, { merge: true })
      .then(() => {
        console.log("Tweet Written Successfully");
        this.analysis.getSentiment({
          text: data.tweet.full_text,
          doc: data.collection
            .doc(data.subscription_id)
            .collection("WatsonData")
            .doc(id),
          isTweet: true,
          tweet_id: id,
          screen_name: data.subscription_name,
          collection: data.collection,
          id_str: data.tweet.id_str,
          subscription_id: data.subscription_id
        });
        this.analysis.getKeyWords({
          text: data.tweet.full_text,
          // tweet_id:data.tweet_id,
          doc: data.collection
            .doc(data.subscription_id)
            .collection("WatsonData")
            .doc(id)
        });
      });
  }

  getReplies(data) {
    let retweet_api_call =
      this.url +
      "/get_replies/" +
      data.screen_name +
      "/" +
      data.subscriptionAcc_id;

    this.http.get<Observable<Tweet_Reply[]>>(retweet_api_call).subscribe(a => {
      a.forEach(element => {
        this.saveReplies({
          collection: data.collection,
          subscription_id: data.subscription_id,
          tweet_id: data.tweet_id,
          reply: element,
          analysis: data._analysis
        });
      });
    });
  }

  async saveReplies(data) {
    const id = this.afs.createId();

    await data.collection
      .doc(data.subscription_id)
      .collection("RawData")
      .doc(data.tweet_id)
      .collection("Replies")
      .doc(id)
      .set({ reply: data.reply }, { merge: true })
      .then(() => {
        console.log("Reply saved");
        data.analysis.getSentiment({
          text: data.reply,
          doc: data.collection
            .doc(data.subscription_id)
            .collection("WatsonData")
            .doc(id),
          collection: data.collection
            .doc(data.subscription_id)
            .collection("WatsonData"),
          tweet_id: data.tweet_id
        });
      });
  }
}
