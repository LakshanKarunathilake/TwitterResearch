import { Sentiment } from "../SentimentModels/Sentiment";

export interface Tweet_Sentiment{
    description?: string;
    doc_id?:string; 
    sentiment?: Sentiment;
    reply_sentiment?:Sentiment;
}