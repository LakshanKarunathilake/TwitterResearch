import { Platform } from 'ionic-angular';
import { AngularFirestore } from "angularfire2/firestore";

import { HttpClient } from "@angular/common/http";
import { Tweet } from "../../models/Tweet";
import { Observable } from "rxjs";
import { Tweet_Reply } from '../../models/Tweet_Reply';


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
       
        if(data.tweet.img_url != undefined){
            // console.log('img',data.element.img_url);
            console.log('img',data.tweet.img_url);
            this.callToVisionAPI(data.tweet.img_url);
        }
        
    
        data.collection.doc(data.subscription_id).collection('RawData').doc(id)
        .set(data.tweet,{merge:true})
        .then(()=>{
            console.log('Data Written Successfully');
            this.getReplies({
                collection:data.collection,
                subscription_id: data.subscription_id,
                tweet_id:id,
                screen_name:data.subscription_name

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

    callToVisionAPI(img_url:string){
        let vision_api = this.url+"/get_image_analyse"
        this.http.post(vision_api,{img_url:img_url}).subscribe(data=>{
            console.log(data);
        })
    }

    getReplies(data){
        let retweet_api_call = this.url+"/get_replies/"+data.screen_name+"/"+data.tweet_id;
        this.http.get<Observable<Tweet_Reply[]>>(retweet_api_call).
        subscribe(a=>{
            a.forEach(element => {
                this.saveReplies(
                    {
                        collection: data.collection,
                        subscription_id: data.subscription_id,
                        tweet_id: data.tweet_id,
                        reply: element
                    }
                )
            });
        })
    }

    saveReplies(data){
        const id = this.afs.createId();
        data.collection.doc(data.subscription_id).collection('RawData').doc(data.tweet_id).collection('Replies').doc(id)
        .set(data.element,{merge:true})
    }
   


}