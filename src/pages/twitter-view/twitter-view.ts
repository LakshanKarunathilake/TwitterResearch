import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform
} from "ionic-angular";
import { TwitterUser } from "../../models/TwitterUsers";

import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Fire_Twitter } from "../../models/Frie_Twitter";
import { InsertToFireStore } from "./InserToFireStore";
import { HttpClient } from "@angular/common/http";

/**
 * Generated class for the TwitterViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-twitter-view",
  templateUrl: "twitter-view.html"
})
export class TwitterViewPage {
  twitter_user: TwitterUser;

  subscribed_accounts_collection: AngularFirestoreCollection<Fire_Twitter>;
  subscribed_accounts: Fire_Twitter[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private _platform: Platform
  ) {
    this.twitter_user = this.navParams.get("acc_data");
    // this.user_loggedIn = this.navParams.get('logged_in');
    // console.log('docID',this.user_loggedIn.document_ID);
  }

  async subscribe() {
    var a = await this.checkSuitability();

    console.log(a);
    let b = Object.keys(a);
    console.log("b is", b.length);

    if (b.length >= 0 && b.length < 5) {
      let exists: boolean = false;
      for (let index = 0; index < b.length; index++) {
        if (a[index].id == this.twitter_user.id_str) {
          exists = true;
        }
      }
      if (!exists) {
        this.createTwitterSubscribe();
      } else {
        this.alertCtrl
          .create({
            message: "You have already subscribed for this channel",
            buttons: ["dismiss"]
          })
          .present();
      }
    } else {
      this.alertCtrl
        .create({
          message: "You have already subscibed the maximum limit",
          buttons: ["dismiss"]
        })
        .present();
    }
    this.navCtrl.pop();

    // Saving Data To the Database
  }

  checkSuitability() {
    let user_id = localStorage.getItem("user_id");
    let user_doc_id = localStorage.getItem("user_doc_id");
    console.log("user_id", user_id);
    console.log("user_doc_id", user_doc_id);

    return new Promise((resolve, reject) => {
      this.subscribed_accounts_collection = this.afs
        .collection("UserData", ref => {
          return ref.where("userID", "==", user_id);
        })
        .doc(user_doc_id)
        .collection("TwitterSubscriptions");

      this.subscribed_accounts_collection.valueChanges().subscribe(data => {
        console.log(data);
        this.subscribed_accounts = data;
        console.log("type of ", typeof data);
        resolve(data);
      });
    });
  }

  createTwitterSubscribe() {
    const subscription_ID = this.afs.createId();
    this.subscribed_accounts_collection
      .doc(subscription_ID)
      .set(
        {
          id: this.twitter_user.id_str,
          name: this.twitter_user.screen_name
        },
        { merge: true }
      )
      .then(() => {
        let insertion = new InsertToFireStore(
          this.afs,
          this.http,
          this._platform
        );
        insertion.ObtainData({
          collection: this.subscribed_accounts_collection,
          id: subscription_ID,
          name: this.twitter_user.screen_name
        });
      });
  }
}
