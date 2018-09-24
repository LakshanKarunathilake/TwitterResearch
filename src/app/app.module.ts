import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { MyApp } from "./app.component";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { HttpClientModule } from "@angular/common/http";
import { ChartsModule } from "ng2-charts";

const config = {
  apiKey: "AIzaSyCvhv7ToWGOG-PX9Ah3kFuJzy4jVOaJbjI",
  authDomain: "trendspotter-b7cec.firebaseapp.com",
  databaseURL: "https://trendspotter-b7cec.firebaseio.com",
  projectId: "trendspotter-b7cec",
  storageBucket: "trendspotter-b7cec.appspot.com",
  messagingSenderId: "731135905057"
};

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    HttpClientModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
