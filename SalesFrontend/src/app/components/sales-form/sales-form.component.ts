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
  }

  onSubmit() {
    if (this.salesForm.valid) {
      this.salesService.postVenta(this.salesForm.value).subscribe({
        next: (res) => {
          alert('Venta registrada con éxito');
          this.salesForm.reset({
            cantidad: 1,
            metodoPago: 'Efectivo',
            precio: 0,
            producto: '',
            categoria: '',
          });
        },
        error: (err) => console.error('Error al guardar', err),
      });
    }
  }
}
