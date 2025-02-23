import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

interface UserStats {
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  rejectedReservations: number;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-analytics.component.html',
  styleUrls: ['./user-analytics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserAnalytics implements OnInit, OnDestroy {
  stats: UserStats = {
    totalReservations: 0,
    pendingReservations: 0,
    approvedReservations: 0,
    rejectedReservations: 0
  };

  private baseApiUrl = 'http://localhost:8080/api/dashboard/userstats';
  isLoading = true;
  private charts: Chart[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  loadUserStats(): void {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const apiUrl = `${this.baseApiUrl}?username=${encodeURIComponent(currentUser.username)}`;

    this.http.get<UserStats>(apiUrl).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        setTimeout(() => {
          this.renderStatusChart();
        }, 100);
      },
      error: (err) => {
        console.error('Error loading user stats:', err);
        this.isLoading = false;
      }
    });
  }

  renderStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approuvé', 'En attente', 'Rejeté'],
        datasets: [{
          data: [
            this.stats.approvedReservations,
            this.stats.pendingReservations,
            this.stats.rejectedReservations
          ],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '70%'
      }
    });
    this.charts.push(chart);
  }
}