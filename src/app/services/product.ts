import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Product {
  private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}

}
