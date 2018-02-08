import '../app.js';
import { Component, OnInit, Injectable } from '@angular/core';
import { CommandService } from './shared';
import { CommandRequest } from './shared/Modals/CommandRequest';



@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [CommandService]
})

@Injectable()
export class AppComponent implements OnInit {

    _postArray: CommandRequest[];
    //data: CommandRequest;
    constructor(private apiSerivce: CommandService) {
    }


     
     data: CommandRequest  = { InstanceId: 'c4977c71-fc12-49f5-b67f-73e3c997391c' , Handler: 'Test', Value: 'Test', MaxAttempts: 20 };

     
    insert():void {
        this.apiSerivce.insert(this.data).subscribe((res) => {
            console.log("test");
            console.log(res);
        }, err => {
            console.log("test error");
            console.log(err);
        });
    }
    // getPosts():void {
    //     // console.log('I got it here..1');
    //     // this.apiSerivce.insert(data).subscribe((result) => {
    //     //     console.log(result);
    //     // },err => {
    //     //     console.log(err);
    //     // }
    //     // this.apiSerivce.getAll()
    //     // .subscribe((resultArray) => {
    //     //     console.log('I got it here.. 2');
    //     //     this._postArray = resultArray;
    //     //     console.log('I got it here.. 3');
    //     //     console.log(this._postArray);
    //     //     console.log('I got it here.. 4');
            
    //     // },
    //     // err => {
    //     //      console.log("Error::" +err);
    //     // }
    // //);

    //     console.log(this._postArray);
    // }

    ngOnInit():void {
        this.insert();
    }

    
}
