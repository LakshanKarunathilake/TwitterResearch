import {Component, NgModule, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import {Chart } from 'chart.js'

@NgModule({
  imports:[ChartsModule]
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

  user_data;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_data = navParams.data;
    console.log(this.user_data)
  }


  @ViewChild('lineCanvas1') lineCanvas1;

  barChart: any;


  ionViewDidLoad() {

    var chartColors = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(231,233,237)'
    };

    this.barChart = new Chart(this.lineCanvas1.nativeElement, {

      type: 'line',
      data: {
        labels: [new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), new Date("Wed Aug 01 16:30:05").toLocaleTimeString(), "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [14, 91, 21, 30, 2, 3],
          borderColor: chartColors.red,
          backgroundColor: chartColors.red,
          fill: false,
          borderWidth: 1
        },
          {
            label: '# of Votes',
            data: [110, 398, 0, 169, 22, 5],
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

  }
}
