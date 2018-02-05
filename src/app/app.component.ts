import { Component } from '@angular/core';


import '../style/app.scss';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: require('./app.component.html'),
  styleUrls: [require('./app.component.scss')],
})
export class AppComponent {
  url = 'https://github.com/preboot/angular2-webpack';
  title: string;

  constructor() {
    this.title = "this is demo";
  }
}
