import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:5207/api/Ventas';

  constructor(private http: HttpClient){}

  getVentas(): Observable<Venta[]>{
    return this.http.get<Venta[]>(this.apiUrl);
  }

  postVenta(venta: Venta): Observable<Venta>{
    return this.http.post<Venta>(this.apiUrl, venta);
  }
}
