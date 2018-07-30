import { LoadingController,Loading} from "ionic-angular/umd";

export class LoadingView {
    loading:Loading;
    constructor(private loadingCtrl:LoadingController){
        
    }

    presentLoading(){
        this.loading = this.loadingCtrl.create({
          content: 'Please wait till loads'
        });
        this.loading.present();
    }

    hideLoading(){
        this.loading.dismiss();
    }
}