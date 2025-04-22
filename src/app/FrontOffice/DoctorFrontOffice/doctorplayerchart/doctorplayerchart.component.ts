import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, ChartType, ChartData, ChartOptions } from 'chart.js';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-doctorplayerchart',
  templateUrl: './doctorplayerchart.component.html',
  styleUrls: ['./doctorplayerchart.component.css']
})
export class DoctorplayerchartComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  chartType: 'doughnut' = 'doughnut';

  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      label: 'Par Gravité',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%' // 👈 pour créer un trou au milieu du doughnut
  };

  constructor(private monService: ServiceDoctorService) {}

  ngAfterViewInit(): void {
    this.monService.getGraviteStatsByPlayer().subscribe(data => {
      console.log('✅ Données reçues:', data);
      this.chartData.labels = data.map(item => item[0]);
      this.chartData.datasets[0].data = data.map(item => item[1]);

      setTimeout(() => {
        this.createChart();
      }, 0);
    });
  }

  createChart(): void {
    if (!this.chartCanvas) {
      console.error('chartCanvas non disponible');
      return;
    }

    const ctx = (this.chartCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: this.chartType,
        data: this.chartData,
        options: this.chartOptions,
        plugins: [this.centerTextPlugin]
      });
    } else {
      console.error('Le contexte du canvas n\'est pas disponible.');
    }
  }

  centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart: any) {
      const { width, height, ctx } = chart;
      ctx.restore();
      const fontSize = (height / 150).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#666';
      const text = 'Total';
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  };
}
