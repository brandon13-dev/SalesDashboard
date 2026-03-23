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
      this.renderChart(data); // esta es la gráfica de barras
      this.renderPieChart(data);
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

  renderPieChart(ventas: any[]){
    const categorias = ventas.reduce((acc, curr) => {
      acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.total;
      return acc;
    }, {});

    new Chart("pieChart", {
      type: "doughnut",
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          data: Object.values(categorias),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins:{
          legend: {position: "bottom"}
        }
      }
    });
  }
}
