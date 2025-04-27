import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommentServiceService } from 'src/app/services/serviceComment/comment-service.service';

@Component({
  selector: 'app-comment-stats',
  standalone: true,
  templateUrl: './comment-stats.component.html',
  styleUrls: ['./comment-stats.component.css'],
  imports: [CommonModule, NgChartsModule]
})
export class CommentStatsComponent implements OnInit {


  @Input()stats: any;
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };


  constructor(private commentService: CommentServiceService) {}

  ngOnInit(): void {
    this.commentService.getGlobalCommentStats().subscribe(stats => {
      this.stats = stats;

      this.pieChartData = {
        labels: ['Positifs', 'Négatifs', 'Neutres'],
        datasets: [{
          data: [
            this.stats?.POSITIVE || 0,
            this.stats?.NEGATIVE || 0,
            this.stats?.NEUTRAL || 0
          ],
          backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
        }],
      };

      this.pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      };
    });
  }
}
