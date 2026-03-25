import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Venta } from '../models/venta.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = 'http://localhost:5207/api/Ventas';

  private _refreshNeeded$ = new Subject<void>();
  private _ventaParaEditar$ = new Subject<Venta>();

  enviarVentaAEditar(venta: Venta){
    this._ventaParaEditar$.next(venta);
  }

  get ventaParaEditar$(){
    return this._ventaParaEditar$.asObservable();
  }

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) {}

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  postVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      }),
    );
  }

  getVentasPorRango(inicio: string, fin: string): Observable<Venta[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);

    return this.http.get<Venta[]>(`${this.apiUrl}/filtrar`, { params });
  }

  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      }),
    );
  }

  updateVenta(id: number, venta: Venta):Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, venta).pipe(
      tap(() => this._refreshNeeded$.next())
    );
  }
}
