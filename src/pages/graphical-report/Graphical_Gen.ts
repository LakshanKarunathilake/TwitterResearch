import {AngularFirestore} from "angularfire2/firestore";
import { resolveDefinition } from "../../../node_modules/@angular/core/src/view/util";
import { async } from "../../../node_modules/rxjs/internal/scheduler/async";

export class Graphical_Gen{

  constructor(private afs: AngularFirestore){

  }

  getChartData(data){
    return new Promise((resolve,reject)=>{

      this.afs.collection("UserData").doc(data.user_docID).collection("TwitterSubscriptions").doc(data.twitter_docID).collection('RawData').valueChanges()
      .subscribe(chartTweets=>{
        //console.log(chartTweets);
        //chartTweets
        this.sortByDate(chartTweets)
          .then(data=>{
            let created_arr = [];
            let fav_count = [];
            let retweet_count = [];
            let word_count = [];
            let index;
            for (index = 0; index < chartTweets.length; index++) {
              const element = chartTweets[index];
              created_arr.push(new Date(element['created_at']).toLocaleTimeString());
              fav_count.push(element['favorite_count']);
              retweet_count.push(element['retweet_count']);
              word_count.push(element['word_count']);
            }
    
            if(index == chartTweets.length){
              resolve({
                created_arr,
                fav_count,
                retweet_count,
                word_count
              })
            }

          })  
      })
    })
    

  }


  getChartDataForWordCount(data){
    return new Promise((resolve,reject)=>{

      this.afs.collection("UserData").doc(data.user_docID).collection("TwitterSubscriptions").doc(data.twitter_docID).collection('RawData').valueChanges()
      .subscribe(chartTweets=>{
        //console.log(chartTweets);
        //chartTweets
        this.sortByWordCount(chartTweets)
          .then(data=>{
            let created_arr = [];
            let fav_count = [];
            let retweet_count = [];
            let word_count = [];
            let index;
            for (index = 0; index < chartTweets.length; index++) {
              const element = chartTweets[index];
              created_arr.push(new Date(element['created_at']).toLocaleTimeString());
              fav_count.push(element['favorite_count']);
              retweet_count.push(element['retweet_count']);
              word_count.push(element['word_count']);
            }
    
            if(index == chartTweets.length){
              resolve({
                created_arr,
                fav_count,
                retweet_count,
                word_count
              })
            }

          })  
      })
    })
    

  }

  async sortByDate(arr){
    await arr.sort(function(a, b) {
        var dt1 = new Date(a['created_at']).toLocaleTimeString().valueOf();
        var dt2 = new Date(b['created_at']).toLocaleTimeString().valueOf();
        console.log(dt1);
        
        if (dt1 < dt2) return -1;
        if (dt2 < dt1) return 1;
        return 0;
    });

    
  }

  async sortByWordCount(arr){
    await arr.sort(function(a, b) {
            
          if (a['word_count'] <b['word_count']) return -1;
          if (b['word_count'] < a['word_count']) return 1;
          return 0;
      });

      
  }

}
