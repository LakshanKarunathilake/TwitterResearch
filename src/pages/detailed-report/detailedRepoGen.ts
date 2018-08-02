import { AngularFirestore } from "angularfire2/firestore";
import { Tweet_Sentiment } from "../../models/SentimentModels/Tweet_Sentiment";
import { Observable } from "rxjs";

export class DetailedReport{
    constructor(private afs:AngularFirestore){
        //this.getAllSentiment();
    }

    subscription_doc;
    tweets:Tweet_Sentiment[]=new Array();
    tweets_observable: Observable<Tweet_Sentiment[]>;
    all_sentiment;

    sentimentData(data){
        
        console.log('sentiment',data)
        this.subscription_doc = this.afs.collection('UserData').doc(data.user_docID).collection('TwitterSubscriptions').doc(data.twitter_docID)
        this.getTweets(data);
        return this.tweets
        
    }

    getTweets(data){
         
        this.subscription_doc.collection('RawData').snapshotChanges()             
        .subscribe( val =>{         


            val.forEach(element => {
                
                this.getTwitterDescriptionSentiment(
                    {
                        tweet_id: element.payload.doc.id,
                        twitter_docID: data.twitter_docID,
                        description: element.payload.doc.data()
                    }
                )
            }
        );
            
        })
        
        
    }

    getTwitterDescriptionSentiment(data){
        
            
            this.subscription_doc.collection('WatsonData').doc(data.tweet_id).valueChanges()
            .subscribe(a=>{     
                var tweet_sentiment:Tweet_Sentiment = {};   
                
                tweet_sentiment.description = data.description.full_text;
                tweet_sentiment.sentiment = a;  
                //let valuetopush = {'tweet':tweet_sentiment};            
                 this.tweets.push(tweet_sentiment);  
                // console.log(this.tweets);
               // this.tweets[0] = tweet_sentiment 
                      
              
            })
    
    }

    getAllSentiment(){
        this.subscription_doc.collection('WatsonData').snapshotChanges()
            .subscribe(val=>{
                this.all_sentiment= val;
                console.log(this.all_sentiment);
            });
    }

    get_all_sentiment() {
        return this.all_sentiment;
    }

   

}