import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { Tweet_Sentiment } from "../../models/SentimentModels/Tweet_Sentiment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class DetailedReport{
    constructor(private afs:AngularFirestore){

    }

    subscription_doc:AngularFirestoreDocument
    tweets:Array<Tweet_Sentiment> = new Array<Tweet_Sentiment>();
    tweets_observable: Observable<Tweet_Sentiment[]>;

    async sentimentData(data){
        
        console.log('sentiment',data)
        this.subscription_doc = this.afs.collection('UserData').doc(data.user_docID).collection('TwitterSubscriptions').doc(data.twitter_docID)
        await this.getTweets(data)
        return this.tweets_observable;
        
        
        
        
    }

    // async getTweets(data){
         
    //     await this.subscription_doc.collection('RawData').snapshotChanges()           

        
    //     .subscribe( val =>{         


    //         val.forEach(element => {
                
    //             this.getTwitterDescriptionSentiment(
    //                 {
    //                     tweet_id: element.payload.doc.id,
    //                     twitter_docID: data.twitter_docID,
    //                     description: element.payload.doc.data()
    //                 }
    //             )
                
    //         }
    //     );
            
    //     })
        
        
    // }


    getTweets(data){
         
       this.tweets_observable =  this.subscription_doc.collection('RawData').snapshotChanges().pipe(
            map(actions => actions.map(a => {
             
              let b = {
                  description: a.payload.doc.data().full_text,
                  sentiment: this.getTwitterDescriptionSentiment(
                                    {
                                        tweet_id: a.payload.doc.id,
                                        twitter_docID: data.twitter_docID,
                                        description: a.payload.doc.data()
                                    }
                                )
              }
              return {...b};
            }))
          );  
        
    }

    async getTwitterDescriptionSentiment(data){
        
        var tweet_sentiment:Tweet_Sentiment = {};
        await this.subscription_doc.collection('WatsonData').doc(data.tweet_id).valueChanges()
            .subscribe(a=>{     
                 
               
                tweet_sentiment.description = data.description.full_text;
                tweet_sentiment.sentiment = a;                  
                
                this.tweets.push(tweet_sentiment)
                      
              
        })
        return tweet_sentiment;
    
    }

   

}