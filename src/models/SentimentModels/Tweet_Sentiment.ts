import { Sentiment } from "../SentimentModels/Sentiment";

export interface Tweet_Detail {
  description?: string;
  doc_id?: string;
  sentiment?: Sentiment;
  reply_sentiment?: Sentiment;
  vision_analysis?;
}
