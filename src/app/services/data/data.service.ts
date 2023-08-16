import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data: any = {};
  private baseUrl: string = 'http://localhost:3030';
  change: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private http: HttpClient) {}

  setParams(body: any) {
    this.data = body;
  }

  get params() {
    return this.data;
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
