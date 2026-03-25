import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss',
})
export class SalesFormComponent implements OnInit {
  salesForm!: FormGroup;
  esEdicion = false;
  idEdicion?:  number;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
  ) {}

  ngOnInit(): void {
    this.salesForm = this.fb.group({
      producto: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['Abarrotes', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.1)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      metodoPago: ['Efectivo', Validators.required],
    });

    this.salesService.ventaParaEditar$.subscribe(venta => {
      this.esEdicion = true;
      this.idEdicion = venta.id;
      this.salesForm.patchValue(venta);
    })
  }

  onSubmit() {
    if (this.salesForm.valid) {
      const venta = this.salesForm.value;

      if(this.esEdicion && this.idEdicion){
        this.salesService.updateVenta(this.idEdicion, { ...venta, id: this.idEdicion}).subscribe({
          next: () => this.finalizarAccion('Venta actualizada'),
          error: (err) => console.error(err)
        });
      } else {
        this.salesService.postVenta(venta).subscribe({
          next: () => this.finalizarAccion('Venta Registrada'),
          error: (err) => console.error(err)
        });
      }
    }
  }

  finalizarAccion(mensaje: string){
    alert(mensaje);
    this.esEdicion = false;
    this.idEdicion = undefined;
    this.salesForm.reset({
            cantidad: 1,
            metodoPago: 'Efectivo',
            precio: 0,
            producto: '',
            categoria: 'Abarrotes',
          });
  }
}
