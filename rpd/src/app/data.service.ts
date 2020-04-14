import {Injectable} from '@angular/core';
import {Post} from './Post';
import {Observable, of} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  ELEMENT_DATA: Post[] = [
    {position: 0, title: 'Post One', category: 'Web Development', date_posted: new Date(), body: 'Body 1'},
    {position: 1, title: 'Post Two', category: 'Android Development', date_posted: new Date(), body: 'Body 2'},
    {position: 2, title: 'Post Three', category: 'IOS Development', date_posted: new Date(), body: 'Body 3'},
    {position: 3, title: 'Post Four', category: 'Android Development', date_posted: new Date(), body: 'Body 4'},
    {position: 4, title: 'Post Five', category: 'IOS Development', date_posted: new Date(), body: 'Body 5'},
    {position: 5, title: 'Post Six', category: 'Web Development', date_posted: new Date(), body: 'Body 6'},
  ];
  categories = [
    {value: 'Web-Development', viewValue: 'Web Development'},
    {value: 'Android-Development', viewValue: 'Android Development'},
    {value: 'IOS-Development', viewValue: 'IOS Development'}
  ];

  constructor() {
  }

  getData(): Observable<Post[]> {
    return of<Post[]>(this.ELEMENT_DATA);
  }

  getCategories() {
    return this.categories;
  }

  addPost(data) {
    this.ELEMENT_DATA.push(data);
  }

  deletePost(index) {
    this.ELEMENT_DATA = [...this.ELEMENT_DATA.slice(0, index), ...this.ELEMENT_DATA.slice(index + 1)];
  }

  dataLength() {
    return this.ELEMENT_DATA.length;
  }
}

export class ApiService {

  private RDP_API_SERVICE= 'https://us-central1-rpdweb-4af2c.cloudfunctions.net/app';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      'Authorization': 'my-auth-token'
    }),
    responseType: "text" as "json"
  };

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


  getRPD() {
    var self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/rpd`;
    return self.http.get<RPDTableItems>(requestUrl,self.httpOptions).pipe(catchError(self.handleError));
}

  getRPDObservable(sort: string, order: string): Observable<RPDTableItems> {
    var self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/rpd`;
    return self.http.get<RPDTableItems>(requestUrl);
  }

  postRPD(body){
    var self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/rpd`;
    return self.http.post(requestUrl, body, self.httpOptions).pipe(catchError(this.handleError));
  }
}

export interface RPDApi {
  id: string;
  fecha: string;
  situacion: string;
  pensamiento: string;
  emocion: string;
  respuesta: string;
  resultado: string;
  title: string;
}

export interface RPDTableItems{
  items: RPDApi[];
  totalCount: number;
}