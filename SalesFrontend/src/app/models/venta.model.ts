export interface Venta {
  id?: number;
  producto: string;
  categoria: string;
  precio: number;
  cantidad: number;
  fecha: Date;
  total: number;
  metodoPago: string; // nueva propiedad
}
