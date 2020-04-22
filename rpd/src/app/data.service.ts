import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {  AuthService } from './shared/services/auth.service'

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private RDP_API_SERVICE= 'https://us-central1-rpdweb-4af2c.cloudfunctions.net/app';
  
  headers= new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('rpdWeb')).stsTokenManager.accessToken
  });

  responseType= "text" as "json"
  

  constructor(private http: HttpClient, private authService: AuthService) { }

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

  getRPDObservable(sort: string, order: string): Observable<RPDTableItems> {
    let self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/rpd?user=${JSON.parse(localStorage.getItem('rpdWeb')).uid}`;
    const httpOptions = {
      headers: self.headers
    };
    return self.http.get<RPDTableItems>(requestUrl, httpOptions);
  }

  postRPD(body){
    let self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/rpd`;
    const httpOptions = {
      headers: self.headers,
      body: body
    };
    return self.http.post(requestUrl, body, httpOptions).pipe(catchError(this.handleError));
  }

  deleteRPD(item){
    let self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/rpd`;
    let options = {
      body: item,
      headers: self.headers,
      responseType: self.responseType
    }
    return self.http.delete(requestUrl, options).pipe(catchError(this.handleError));
  }

  signOut(){
    let self = this;
    const requestUrl = `${self.RDP_API_SERVICE}/signout`;
    let options = {
      headers: self.headers,
      responseType: self.responseType
    }
    return self.http.delete(requestUrl, options).pipe(catchError(this.handleError));
  }
}

export interface RPDApi {
  id: string;
  fecha: string;
  situacion: string;
  pensamiento: string;
  emocion: string;
  respuesta: RespuestaRdp;
  resultado: string;
  title: string;
}
export interface RpdNewItem{
  id: string;
  fecha: string;
  situacion: string;
  pensamiento: string;
  emocion: string;
  respuesta: RespuestaRdp;
  resultado: string;
  user: string;
}

export interface RespuestaRdp {
  respuesta1: string;
  respuesta2: string;
  respuesta3: string;
  respuesta4: string;
  respuesta5: string;
  respuesta6: string;
  respuesta7: string;
  respuesta8: string;
  respuesta9: string;
  respuesta10: string;
  respuesta11: string;
}

export interface RPDTableItems{
  items: RPDApi[];
  totalCount: number;
}