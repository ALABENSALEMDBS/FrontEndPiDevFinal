import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-chartsdoctor',
  templateUrl: './chartsdoctor.component.html',
  styleUrls: ['./chartsdoctor.component.css']
})
export class ChartsdoctorComponent implements AfterViewInit {

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;


  chartType: ChartType = 'doughnut';
  chartData: ChartData = {
    labels: [],
    datasets: [{
      label: 'Par Gravité',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // tu peux ajouter plus
    }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  constructor(private monService: ServiceDoctorService) {}

  ngAfterViewInit(): void {
    this.monService.getGraviteStatsByPlayer().subscribe(data => {
      console.log('✅ Données reçues:', data); // Ajoute ceci
  
      this.chartData.labels = data.map(item => item[0]); // Gravité
      this.chartData.datasets[0].data = data.map(item => item[1]); // Count
  
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
        options: this.chartOptions
      });
    } else {
      console.error('Le contexte du canvas n\'est pas disponible.');
    }
  }

  
}
