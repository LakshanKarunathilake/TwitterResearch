import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { Tweet_Sentiment } from "../../models/SentimentModels/Tweet_Sentiment";
import { Observable } from "rxjs";
import { Sentiment } from "../../models/SentimentModels/Sentiment";

export class DetailedReport{
    constructor(private afs:AngularFirestore){
        //this.getAllSentiment();
    }

    subscription_doc:AngularFirestoreDocument

    tweets_observable: Observable<Tweet_Sentiment[]>;





    getTweets(data){

        this.subscription_doc = this.afs.collection('UserData').doc(data.user_docID).collection('TwitterSubscriptions').doc(data.twitter_docID);

        return new Promise((resolve,reject)=>{
            this.subscription_doc.collection('RawData').snapshotChanges().subscribe(val=>{
                this.subscription_doc.collection('WatsonData').snapshotChanges().subscribe(val2=>{


                    let twitter_sentiment:Tweet_Sentiment[]=[];
                    val.forEach(element => {
                        let ts:Tweet_Sentiment={};
                        let sentiment:Sentiment= {}
                        val2.forEach(element2 => {

                            if(element.payload.doc.id == element2.payload.doc.id){

                                // console.log('description',element.payload.doc.data().full_text);
                                // console.log('sentiment',element2.payload.doc.data().sentiment);
                                // console.log('emotion',element2.payload.doc.data().emotion)

                                ts.description = element.payload.doc.data().full_text;
                                ts.doc_id = element2.payload.doc.id;
                                sentiment.Anger = element2.payload.doc.data().emotion.Anger;
                                sentiment.Fear = element2.payload.doc.data().emotion.Fear;
                                sentiment.Joy = element2.payload.doc.data().emotion.Joy;
                                sentiment.sentiment = element2.payload.doc.data().sentiment;
                                ts.sentiment = sentiment;
                                ts.reply_sentiment = element2.payload.doc.data().AVGS;
                                console.log('adding to array')

                            }

                        });
                        twitter_sentiment.push(ts);
                    });


                    resolve(twitter_sentiment);
                })
            })
        })

    }

    getReplySentiment(data){
        return new Promise((res,rej)=>{
            let sentiment:Sentiment={}
            this.subscription_doc.collection('WatsonData').doc(data.tweet_id).collection('ReplySentiments').valueChanges().subscribe(val=>{
                let average_sentiment:number=0;
                let average_anger:number=0;
                let average_joy:number=0;
                let average_fear:number=0;

                // console.log(this.tweets);
               // this.tweets[0] = tweet_sentiment
                val.forEach(reply => {
                    average_sentiment+= +reply.sentiment
                    average_anger+= +reply.emotion.Anger;
                    average_joy+= +reply.emotion.Joy;
                    average_fear+= +reply.emotion.Fear;
                });

                sentiment.sentiment = (average_sentiment/val.length);
                sentiment.Anger = (average_anger/val.length);
                sentiment.Joy = (average_joy/val.length);
                sentiment.Fear = (average_fear/val.length);

                res(sentiment)

            })
        })


    }

    saveAvgs(data){
        this.subscription_doc.collection('WatsonData').doc(data.tweet_id)
        .set({AVGS:data.avgs},{merge:true}).then(()=>{
            console.log('Written Avg Data')
        })
    }


}
