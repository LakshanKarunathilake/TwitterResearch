import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
export class AnalysisToDB{

    private url = "/api";

    constructor(private http:HttpClient,private afs:AngularFirestore){

    }

    callToVisionAPI(data){
        let vision_api = this.url+"/get_image_analyse";
        console.log('got Data',data);
        this.http.post(vision_api,{img_url:data.img_url}).subscribe(a=>{
            console.log('Vision api sent',a)
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

    getTheSentiment(data){
        let vision_api = this.url+"/get_image_analyse"
        this.http.post(vision_api,{text: data.text}).subscribe(a=>{
            this.saveSentiment(
                {
                    doc: data.doc,
                    description_sentiment: a
                }
            );
        })
    }

    saveSentiment(data){
        data.doc.update(
            {
                description_sentiment: data.descripiton_sentiment
            }
        )
    }
}