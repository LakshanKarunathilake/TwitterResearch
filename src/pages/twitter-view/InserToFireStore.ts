import { Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Fire_Twitter } from "../../models/Frie_Twitter";
import { HttpClient } from "@angular/common/http";
import { Tweet } from "../../models/Tweet";
import { Observable } from "rxjs";
import { elementAt } from "rxjs/operators";

export class InsertToFireStore{

    private url = "/api";
    Tweets: Observable<Tweet[]>;
    constructor(private afs: AngularFirestore,private http:HttpClient,private _platform:Platform){
        if(this._platform.is("cordova")){      
            this.url = "https://slitt-research-se.appspot.com/";
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
                        subscription_id: data.id
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


}