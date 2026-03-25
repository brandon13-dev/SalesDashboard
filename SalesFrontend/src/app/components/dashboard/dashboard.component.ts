import { Component, OnInit } from '@angular/core';
import { Chart, plugins, registerables } from 'chart.js';
import { SalesService } from '../../services/sales.service';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  chartBarra: any;
  chartDona: any;
  chartDonaMetodosPago: any;
  datosActuales: any[] = [];
  metricaActual: string = 'total';

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.cargarDatos();

    this.salesService.refreshNeeded$.subscribe(() => {
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.salesService.getVentas().subscribe((data) => {
      this.datosActuales = data;
      // Calculos
      this.totalVentas = data.reduce((sum, item) => sum + item.total, 0);
      this.totalProductos = data.reduce((sum, item) => sum + item.cantidad, 0);
      this.promedioVenta = data.length > 0 ? this.totalVentas / data.length : 0;

      // Renderizar las graficas
      this.cambiarMetrica(this.metricaActual);
    });
  }

  renderCharts(data: any[]) {
    if (this.chartBarra) this.chartBarra.destroy();
    if (this.chartDona) this.chartDona.destroy();
    if (this.chartDonaMetodosPago) this.chartDonaMetodosPago.destroy();

    const top5 = data.slice(0, 5);

    this.chartBarra = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: top5.map((v) => v.producto),
        datasets: [
          {
            label:
              this.metricaActual === 'total'
                ? 'Ingresos ($)'
                : 'Unidades Vendidas',
            data: top5.map((v) =>
              this.metricaActual === 'total' ? v.total : v.cantidad,
            ),
            backgroundColor:
              this.metricaActual === 'total' ? '#42A5F5' : '#66BB6A',
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) label += ': ';

                const valor = context.parsed.y || 0;

                if (this.metricaActual === 'total') {
                  return (
                    label +
                    new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(valor)
                  );
                } else {
                  return label + valor + ' unidades';
                }
              },
            },
          },
        },
      },
    });

    const categorias = data.reduce((acc, curr) => {
      acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.total;
      return acc;
    }, {});

    this.chartDona = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: Object.keys(categorias),
        datasets: [
          {
            data: Object.values(categorias),
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    const metodos = data.reduce((acc, curr) => {
      acc[curr.metodoPago] = (acc[curr.metodoPago] || 0) + curr.total;
      return acc;
    }, {});

    this.chartDonaMetodosPago = new Chart('pieChartPago', {
      type: 'doughnut',
      data: {
        labels: Object.keys(metodos),
        datasets: [
          {
            data: Object.values(metodos),
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }

  generarPDF() {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.text('Reporte Estadístico de Ventas', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text(`Fecha de emisión: ${fecha}`, 105, 30, { align: 'center' });
    doc.line(20, 35, 190, 35); // linea para dividir

    // Resumen de KPI's
    doc.setFont('times', 'bold');
    doc.text('Resumen Ejecutivo:', 20, 45);
    doc.setFont('times', 'normal');
    doc.text(`- Total Ingreso: $${this.totalVentas.toFixed(2)}`, 25, 55);
    doc.text(`- Ticket Promedio: $${this.promedioVenta.toFixed(2)}`, 25, 62);
    doc.text(`- Volumen de Productos: ${this.totalProductos} unidades`, 25, 69);

    // Tabla de datos
    autoTable(doc, {
      startY: 80,
      head: [
        ['Producto', 'Categoría', 'Precio', 'Cant.', 'Total', 'Met. Pago'],
      ],
      body: this.datosActuales.map((v) => [
        v.producto,
        v.categoria,
        `$${v.precio}`,
        v.cantidad,
        `$${v.total}`,
        v.metodoPago,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { font: 'times' },
    });

    // pie de pagina
    const totalPages = doc.internal.pages.length - 1;

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${totalPages}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' },
      );
    }

    doc.save(`Reporte_Ventas_${fecha}.pdf`);
  }

  filtrar(inicio: string, fin: string) {
    if (!inicio || !fin) return;

    this.salesService.getVentasPorRango(inicio, fin).subscribe((data) => {
      this.totalVentas = data.reduce((sum, item) => sum + item.total, 0);
      this.renderCharts(data);
    });
  }

  cambiarMetrica(metrica: string) {
    this.metricaActual = metrica;
    const datosOrdenados = [...this.datosActuales];

    if (metrica == 'total') {
      datosOrdenados.sort((a, b) => b.total - a.total);
    } else {
      datosOrdenados.sort((a, b) => b.cantidad - a.cantidad);
    }

    this.renderCharts(datosOrdenados);
  }
}
