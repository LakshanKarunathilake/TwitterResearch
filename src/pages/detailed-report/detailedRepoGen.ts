import { AngularFirestore } from "angularfire2/firestore";
import { Tweet_Sentiment } from "../../models/SentimentModels/Tweet_Sentiment";

export class DetailedReport{
    constructor(private afs:AngularFirestore){

    }

    subscription_doc;
    tweets:Tweet_Sentiment[]=[]
    dummy;

    async sentimentData(data){
        
        console.log('sentiment',data)
        this.subscription_doc = this.afs.collection('UserData').doc(data.user_docID).collection('TwitterSubscriptions').doc(data.twitter_docID)
        this.getTweets(data);
        return this.tweets;
    }

    async getTweets(data){
         
        await this.subscription_doc.collection('RawData').snapshotChanges()           

        
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
                // var ts:Tweet_Sentiment   
                let tweet_sentiment  
                tweet_sentiment =
                    {
                        description: data.description.full_text,
                        sentiment: a
                    }       
                // console.log('text',data.description.full_text)
                // ts.description = data.description.full_text;
                // // ts.sentiment = a;
                this.tweets.push(tweet_sentiment)              
                
            })
    
     
       
               
        
    
    }

   

}