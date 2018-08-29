import {AngularFirestore} from "angularfire2/firestore";


export class Graphical_Gen{

  constructor(private afs: AngularFirestore){

  }

  getChartKeyWords(data){
    return new Promise((resolve,reject)=>{
      this.afs.collection("UserData").doc(data.user_docID).collection("TwitterSubscriptions").doc(data.twitter_docID).collection('WatsonData').valueChanges()
        .subscribe(data=>{
          console.log(data);
          let keywords = [];
          let index;
          for(index =0;index<data.length; index++){
            keywords =keywords.concat(data[index]['KeyWords']);
           /* console.log(keywords)
            console.log(data[index]['KeyWords'])*/
          }

          if(index == data.length){
            resolve({keywords});
          }
        });


    })

  }

  getChartData(data){
    return new Promise((resolve,reject)=>{

      this.afs.collection("UserData").doc(data.user_docID).collection("TwitterSubscriptions").doc(data.twitter_docID).collection('RawData').valueChanges()
      .subscribe(chartTweets=>{
        console.log(chartTweets);
        //chartTweets
        this.sortByDate(chartTweets)
          .then(data=>{
            let created_arr = [];
            let fav_count = [];
            let retweet_count = [];

            //let word_count = [];
            let index;
            for (index = 0; index < chartTweets.length; index++) {
              const element = chartTweets[index];
              created_arr.push(new Date(element['created_at']).toLocaleTimeString());
              fav_count.push(element['favorite_count']);
              retweet_count.push(element['retweet_count']);
              //word_count.push(element['word_count']);
            }

            if(index == chartTweets.length){
              resolve({
                created_arr,
                fav_count,
                retweet_count
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
           // let created_arr = [];
            let fav_count = [];
            let retweet_count = [];
            let word_count = [];
            let index;
            for (index = 0; index < chartTweets.length; index++) {
              const element = chartTweets[index];
              //created_arr.push(new Date(element['created_at']).toLocaleTimeString());
              fav_count.push(element['favorite_count']);
              retweet_count.push(element['retweet_count']);
              word_count.push(element['word_count']);
            }

            if(index == chartTweets.length){
              resolve({
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
        //console.log(dt1);

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

  getVisionColors(data){
    return new Promise((resolve,reject)=>{
      this.afs.collection("UserData").doc(data.user_docID).collection("TwitterSubscriptions").doc(data.twitter_docID).collection('VisionAnalysis').valueChanges()
      .subscribe(chartTweets=>{
        console.log('----Vision Subscribed----')
        console.log(chartTweets)
        let colors = [];
        let labels = [];
        let vals = [];
        let index = 0
        for (index = 0; index < chartTweets.length; index++) {
          const element = chartTweets[index];
          colors.push(element.dominant_colors);
          labels.push(element.labels); 
          vals.push(1);        
        }

        if(index == chartTweets.length){
          console.log('-----Ending the loop----')
          resolve({
            colors: colors,
            labels: labels,
            vals: vals
          })
        }
          
          
       
      }
      )
    })
   
  }

}
