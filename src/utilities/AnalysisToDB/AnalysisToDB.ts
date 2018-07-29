import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
export class AnalysisToDB{

    private url = "/api";

    constructor(private http:HttpClient,private afs:AngularFirestore){

    }

    callToVisionAPI(data){
        let vision_api = this.url+"/get_image_analyse";
        
        this.http.post(vision_api,{img_url:data.img_url}).subscribe(a=>{
           
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
        let vision_api = this.url+"/get_sentiment/getSentiment"
        await this.http.post(vision_api,{text: data.text}).subscribe(a=>{
            
            if(data.isTweet){
                this.saveTweetSentiment(
                    {
                        doc: data.doc,
                        description_sentiment: a
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
        })        
    }

    saveReplySentiment(data){
        const id = this.afs.createId();
        // data.doc.collection('ReplySentiment').doc(id).set(    
        console.log('tweeet id',data.tweet_id)  
        data.collection.doc(data.tweet_id).collection('ReplySentiments').doc(id).set(      
               data.descripiton_sentiment
            ,{merge:true}
        ).then(()=>{
            console.log('Watson Reply Sentiment Written')
        }) 
    }

    
}