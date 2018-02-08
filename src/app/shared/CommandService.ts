import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CommandRequest } from './Modals/CommandRequest';
import { HttpClientBase } from './HttpClientBase';

@Injectable()
export class CommandService extends HttpClientBase<CommandRequest>  {
     constructor(http: Http) {               
         super(http,"api/command/subscribe");
     }
}