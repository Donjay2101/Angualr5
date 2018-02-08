import { Http } from '@angular/http';
import { Observable } from 'Rxjs/observable';
import 'rxjs/Rx';


export abstract  class HttpClientBase<T>  {
   
    baseUrl: string = "http://localhost:61356/"; 

    constructor(protected _http: Http, protected actionUrl:string){
      this.actionUrl = this.baseUrl + this.actionUrl;
    }

    getAll():Observable<T[]> {
     
      return this._http.get(this.actionUrl).map(response => response.json() as T[]);
    }
    
    getOne(id:number):Observable<T> {
       return this._http.get(`${this.actionUrl}${id}`).map(response => response.json() as T);
    }

    insert(data: T):any {
      console.log(this.actionUrl);
        return this._http.post(this.actionUrl,data).map(res => res.json());
    }

  }