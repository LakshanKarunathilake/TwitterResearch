import {Component, NgModule, ViewChild, CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import {Chart } from 'chart.js'
import {AngularFirestore} from "angularfire2/firestore";

import { Graphical_Gen } from "./Graphical_Gen";

import * as WordCloud from 'wordcloud';

@NgModule({
  imports:[ChartsModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})

/**
 * Generated class for the GraphicalReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graphical-report',
  templateUrl: 'graphical-report.html',

})
export class GraphicalReportPage {
  repo_gen = new Graphical_Gen(this.afs);
  user_data;

  words_list = []; // hold word list for word cloud

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs:AngularFirestore) {
    this.user_data = navParams.data;
    //console.log(this.user_data)
  }

  @ViewChild('lineCanvas1') lineCanvas1;
  @ViewChild('lineCanvas2') lineCanvas2;

  lineChart1: any;
  lineChart2: any;

  list = [['foo', 25], ['bar', 36]];


  ionViewDidLoad() {



    this.repo_gen.getChartKeyWords(this.user_data)
      .then(data=>{
        console.log(data);
        this.processWord(data['keywords']);
        WordCloud(document.getElementById('canvas'), { list: this.words_list } );
      })

    this.repo_gen.getChartDataForWordCount(this.user_data)
        .then(data=>{
          //console.log(data);


          // chart on word count

          this.lineChart2 = new Chart(this.lineCanvas2.nativeElement, {

            type: 'line',
            data: {
              labels: data['word_count'],
              datasets: [{
                label: '# of Favourites',
                data: data['fav_count'],
                borderColor: chartColors.green,
                backgroundColor: chartColors.green,
                fill: false,
                borderWidth: 1
              },
                {
                  label: '# of Retweets',
                  data: data['retweet_count'],
                  fill: false,
                  borderColor: chartColors.purple,
                  backgroundColor: chartColors.purple,
                  borderWidth: 1
                }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  stacked: true,
                  scaleFontSize: 10,
                  ticks: {
                    autoSkip: false,

                  }
                }]
              }
            }

          });

        });



    this.repo_gen.getChartData(this.user_data)
      .then(data=>{
        console.log(data);

          this.lineChart1 = new Chart(this.lineCanvas1.nativeElement, {

            type: 'line',
            data: {
              labels: data['created_arr'],
              datasets: [{
                label: '# of Favourites',
                data: data['fav_count'],
                borderColor: chartColors.red,
                backgroundColor: chartColors.red,
                fill: false,
                borderWidth: 1
              },
                {
                  label: '# of Retweets',
                  data: data['retweet_count'],
                  fill: false,
                  borderColor: chartColors.blue,
                  backgroundColor: chartColors.blue,
                  borderWidth: 1
                }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  scaleFontSize: 10,
                  ticks: {
                    autoSkip: false,

                  }
                }]
              }
            }

          });



      })

    var chartColors = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(231,233,237)'
    };




    // this.lineChart1 = new Chart(this.lineCanvas1.nativeElement, {

    //   type: 'line',
    //   data: {
    //     labels: [new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), "Purple", "Orange"],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [14, 91, 21, 30, 2, 3],
    //       borderColor: chartColors.red,
    //       backgroundColor: chartColors.red,
    //       fill: false,
    //       borderWidth: 1
    //     },
    //       {
    //         label: '# of Votes',
    //         data: [110, 398, 0, 169, 22, 5],
    //         fill: false,
    //         borderColor: chartColors.blue,
    //         backgroundColor: chartColors.blue,
    //         borderWidth: 1
    //       }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }],
    //       xAxes: [{
    //         scaleFontSize: 10,
    //         ticks: {
    //           autoSkip: false,

    //         }
    //       }]
    //     }
    //   }

    // });

  }

  processWord(originWords) {
    // let content = 'How the Word Cloud Generator Cloud Works Works Works';
    // let originWords = content.split(/\s+/g);

    let counts:any[] = [];
    originWords.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

    Object.keys(counts).map(key=>{
      //console.log(counts[key]);
      //let valuetopush = { : counts[key]};
      this.words_list.push([key, counts[key]+10]);
    });

    console.log(this.words_list);
    //WordCloud(document.getElementById('canvas'), { list: this.words_list } );

    }
}


