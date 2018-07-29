import { Platform } from 'ionic-angular';
import { AngularFirestore } from "angularfire2/firestore";

import { HttpClient } from "@angular/common/http";
import { Tweet } from "../../models/Tweet";
import { Observable } from "rxjs";
import { Tweet_Reply } from '../../models/Tweet_Reply';
import { AnalysisToDB } from '../../utilities/AnalysisToDB/AnalysisToDB';



export class InsertToFireStore{

    private url = "/api";
    Tweets: Observable<Tweet[]>;
    
    constructor(private afs: AngularFirestore,private http:HttpClient,private _platform:Platform){
        if(this._platform.is("cordova")){      
            this.url = "https://slitt-research-se.appspot.com";
        }
        
    }

    saveToCollection(data){
        const id = this.afs.createId();
        let analysis= new AnalysisToDB(this.http,this.afs);       
        if(data.tweet.img_url != undefined){
                        
            analysis.callToVisionAPI(
                {
                    img_url:data.tweet.img_url,
                    tweet_id:data.subscription_id,
                    collection: data.collection
                }
            );
        }
        
    
        data.collection.doc(data.subscription_id).collection('RawData').doc(id)
        .set(data.tweet,{merge:true})
        .then(()=>{
            console.log('Tweet Written Successfully');
            analysis.getSentiment(
                {
                    text: data.tweet.full_text,
                    doc: data.collection.doc(data.subscription_id).collection('WatsonData').doc(id),
                    isTweet: true    
                }
            ).then(()=>{
                this.getReplies(
                    {
                    collection:data.collection,
                    subscription_id: data.subscription_id,
                    tweet_id:id,
                    subscriptionAcc_id:data.tweet.id_str,
                    screen_name:data.subscription_name,
                    _analysis: analysis
                    }
                );
            })
            
            

        })
    }

    ObtainData(data){
        console.log(data.name);
        let searchurl = this.url+"/get_tweet/"+data.name;
        console.log('searchURL',searchurl);
        this.http.get<Observable<Tweet[]>>(searchurl)
        .subscribe(a=>{
            a.forEach(element => {
                this.saveToCollection(
                    {
                        tweet:element,
                        collection: data.collection,
                        subscription_id: data.id,
                        subscription_name: data.name
                        
                    }
                );                           
            }
        );
        })
    }

    getReplies(data){
        let retweet_api_call = this.url+"/get_replies/"+data.screen_name+"/"+data.subscriptionAcc_id;
        
        this.http.get<Observable<Tweet_Reply[]>>(retweet_api_call).
        subscribe(a=>{
            
            a.forEach(element => {
                this.saveReplies(
                    {
                        collection: data.collection,
                        subscription_id: data.subscription_id,
                        tweet_id: data.tweet_id,
                        reply: element,
                        analysis: data._analysis
                    }
                )                
            });
        })
    }

    saveReplies(data){
        const id = this.afs.createId();
        
        data.collection.doc(data.subscription_id).collection('RawData').doc(data.tweet_id).collection('Replies').doc(id)
        .set({reply:data.reply},{merge:true})
        .then(()=>{
            console.log('Reply saved')
            data.analysis.getSentiment(
                {
                    text: data.reply,
                    doc: data.collection.doc(data.subscription_id).collection('WatsonData').doc(id),
                    collection: data.collection.doc(data.subscription_id).collection('WatsonData'),
                    tweet_id:data.tweet_id
                }
            )
            
        })
    }
   


}