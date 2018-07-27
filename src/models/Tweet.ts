export interface Tweet {
    id_str:string;
    created_at: string;
    full_text: string;
    word_count: number;
    retweet_count: number;
    favourite_count:number;
    hash_tags: string[];
    img_url?: string;
}