import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../services/sales.service';
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  totalVentas: number = 0;
  promedioVenta: number = 0;
  totalProductos: number = 0;

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.salesService.getVentas().subscribe(data => {
      // Calculos
      this.totalVentas = data.reduce((sum, item) => sum + item.total, 0);
      this.totalProductos = data.reduce((sum, item) => sum + item.cantidad, 0);
      this.promedioVenta = data.length > 0 ? this.totalVentas / data.length: 0;

      // Renderizar la grafica
      this.renderChart(data);
    });
  }

  renderChart(ventas: any[]) {
    new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ventas.map(v => v.producto),
        datasets: [{
          label: 'Total por Producto ($)',
          data: ventas.map(v => v.total),
          backgroundColor: '#42A5F5'
        }]
      }
    });
  }
}
