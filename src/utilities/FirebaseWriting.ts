export class FirebaseWrite {
    private static userID: string;   

    public static setUserID(data){
        this.userID = data;
    }

    public static getUserID(){
        return this.userID;
    }
}