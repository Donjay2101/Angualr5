import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-home',
    template: '<h1>Home</h1>'
})
export class HomeComponent implements OnInit {
    constructor() {
    }
    ngOnInit() {
        console.log('Hello Home');
    }
}
