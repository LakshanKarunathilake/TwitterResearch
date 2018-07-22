import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { HttpClientModule} from '@angular/common/http'



const config = {
  apiKey: "AIzaSyDN1yPRK2n2Sc9yTJk88G9RmU1O8H-_xpk",
    authDomain: "facebookresearch-cd2a1.firebaseapp.com",
    databaseURL: "https://facebookresearch-cd2a1.firebaseio.com",
    projectId: "facebookresearch-cd2a1",
    storageBucket: "facebookresearch-cd2a1.appspot.com",
    messagingSenderId: "699207289274"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    HttpClientModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
