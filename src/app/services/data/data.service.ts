import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data: any = {};
  private baseUrl: string = 'http://api-iraqsoft.com:18365';
  // 'http://api-iraqsoft.com:46584';
  change: BehaviorSubject<number> = new BehaviorSubject(0);
  baseMongoUrl: string = 'http://209.250.237.58:5640';
  constructor(private http: HttpClient) {}

  setParams(body: any) {
    this.data = body;
  }

  get params() {
    return this.data;
  }
  getMongoData(endPoint: string) {
    return this.http.get(this.baseMongoUrl + endPoint).pipe(take(1));
  }
  postMongoData(endPoint: string, body: any) {
    return this.http.post(this.baseMongoUrl + endPoint, body).pipe(take(1));
  }
  editMongoData(endPoint: string, body: any) {
    return this.http.put(this.baseMongoUrl + endPoint, body).pipe(take(1));
  }
  getData(endPoint: string) {
    return this.http.get(this.baseUrl + endPoint).pipe(take(1));
  }

  postData(endPoint: String, body: any) {
    return this.http.post(this.baseUrl + endPoint, body).pipe(take(1));
  }

  editData(endPoint: string, body: any) {
    return this.http.put(this.baseUrl + endPoint, body).pipe(take(1));
  }

  deleteData(endPoint: string) {
    return this.http.delete(this.baseUrl + endPoint).pipe(take(1));
  }
}
