import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Tweet_Reply } from '../../models/Tweet_Reply';
export class AnalysisToDB{

    private url = "/api";

    constructor(private http:HttpClient,private afs:AngularFirestore,private platform:Platform){
        if(this.platform.is("cordova")){      
            this.url = "https://slitt-research-final.appspot.com";
        }
    }

    async callToVisionAPI(data){
        let vision_api = this.url+"/get_image_analyse";
        
        await this.http.post(vision_api,{img_url:data.img_url}).subscribe(a=>{
           
            this.saveVisionData(               
                {
                    collection:data.collection,
                    vision_data: a,
                    tweet_id: data.tweet_id

                }
            )
            
        })
    }

    saveVisionData(data){       
        const id_vision = this.afs.createId();
       
        data.collection.doc(data.tweet_id).collection('VisionAnalysis').doc(id_vision)        
        .set(data.vision_data,{merge:true})
        .then(()=>{
            console.log('Successfully Written Vision data');
        })

    }

    async getSentiment(data){
        let watson_api = this.url+"/get_sentiment/getSentiment"
        await this.http.post(watson_api,{text: data.text}).subscribe(a=>{
            
            if(data.isTweet){
                this.saveTweetSentiment(
                    {
                        doc: data.doc,
                        description_sentiment: a,
                        tweet_id:data.tweet_id,
                        screen_name: data.screen_name,
                        collection: data.collection,
                        id_str:data.id_str,
                        subscription_id:data.subscription_id

                    }
                );
            }else{               
                this.saveReplySentiment(                    
                    {
                        doc: data.doc,
                        descripiton_sentiment: a,
                        collection: data.collection,
                        tweet_id: data.tweet_id
                    }
                )
            }
            
        })
    }

    saveTweetSentiment(data){
        data.doc.set(            
                 data.description_sentiment
            ,{merge:true}
        ).then(()=>{
            console.log('Watson Tweet Sentiment Written')
            this.getReplies(
                {
                collection:data.collection,
                subscription_id: data.subscription_id,
                tweet_id:data.tweet_id,
                id_str:data.id_str,
                screen_name:data.screen_name,
                
                }
            )
        })        
    }
    getReplies(data){
        let retweet_api_call = this.url+"/get_replies/"+data.screen_name+"/"+data.id_str;
        // console.log(retweet_api_call)
        this.http.get<Observable<Tweet_Reply[]>>(retweet_api_call).
        subscribe(a=>{
            // console.log(a)
            a.forEach(element => {
                this.saveReplies(
                    {
                        collection: data.collection,
                        subscription_id: data.subscription_id,
                        tweet_id: data.tweet_id,
                        reply: element,
                        
                    }
                )                
            });
        })
    }

    async saveReplies(data){
        const id = this.afs.createId();
        
        await data.collection.doc(data.subscription_id).collection('RawData').doc(data.tweet_id).collection('Replies').doc(id)
        .set({reply:data.reply},{merge:true})
        .then(()=>{
            console.log('Reply saved')
            this.getSentiment(
                {
                    text: data.reply,
                    doc: data.collection.doc(data.subscription_id).collection('WatsonData').doc(id),
                    collection: data.collection.doc(data.subscription_id).collection('WatsonData'),
                    tweet_id:data.tweet_id
                }
            )            
            
        })
    }

    saveReplySentiment(data){
        const id = this.afs.createId();
        // data.doc.collection('ReplySentiment').doc(id).set(    
        // console.log('tweeet id',data.tweet_id)  
        data.collection.doc(data.tweet_id).collection('ReplySentiments').doc(id).set(      
               data.descripiton_sentiment
            ,{merge:true}
        ).then(()=>{
            console.log('Watson Reply Sentiment Written')
        }) 
    }

    getReplySentiment(data){
        console.log(data.tweet_id)
        return new Promise((res,rej)=>{
            data.doc.collection('WatsonData').doc(data.tweet_id).collection('ReplySentiments').valueChanges().subscribe(val=>{
                let average_sentiment:number=0;
                let average_anger:number=0;
                let average_joy:number=0;
                let average_fear:number=0;
                
                val.forEach(reply => {
                    average_sentiment+= +reply.sentiment
                    average_anger+= +reply.emotion.Anger;
                    average_joy+= +reply.emotion.Joy;
                    average_fear+= +reply.emotion.Fear;
                });
    
                average_sentiment = (average_sentiment/val.length);
                average_anger = (average_anger/val.length);
                average_joy = (average_joy/val.length);
                average_fear = (average_fear/val.length);
                
                res({
                    average_sentiment,
                    average_anger,
                    average_joy,
                    average_fear
                })
                 
            })
        })
        
    }

    getKeyWords(data){
        let watson_api_keywords = this.url+"/get_sentiment/getKeywords"
        this.http.post(watson_api_keywords,{text: data.text}).subscribe(words=>{
            this.saveKeywords({
                words: words,
                doc: data.doc,
                // tweet_id: data.tweet_id
            });
        })
    }

    saveKeywords(data){
        data.doc.set({KeyWords:data.words},{merge:true})
        .then(()=>{
            console.log('Twitter Keywords Written Successfully')
        })
    }
   

    
}