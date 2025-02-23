import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  rejectedReservations: number;
  fixedReservations: number;
  mostBookedRooms: { local_nom: string, count: number }[];
  reservationsByDay: { day: string, count: number }[];
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  // Propriétés du composant
  stats: DashboardStats = {
    totalReservations: 0,
    pendingReservations: 0,
    approvedReservations: 0,
    rejectedReservations: 0,
    fixedReservations: 0,
    mostBookedRooms: [],
    reservationsByDay: []
  };

  private apiUrl = 'http://localhost:8080/api/dashboard/stats'; // URL de l'API pour récupérer les statistiques du tableau de bord
  isLoading = true; // Indique si les données sont en cours de chargement
  dateRange = '30'; // Plage de dates pour les statistiques (par défaut : 30 jours)
  private charts: Chart[] = []; // Tableau pour stocker les instances de Chart.js

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDashboardData(); // Charge les données du tableau de bord lors de l'initialisation du composant
  }

  ngOnDestroy(): void {
    // Nettoie les graphiques pour éviter les fuites de mémoire
    this.charts.forEach(chart => chart.destroy());
  }

  // Méthode pour charger les données du tableau de bord
  loadDashboardData(): void {
    this.isLoading = true;
    // Efface les graphiques existants
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    this.http.get<DashboardStats>(`${this.apiUrl}?days=${this.dateRange}`)
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.isLoading = false;
          setTimeout(() => {
            this.renderCharts(); // Rend les graphiques après le chargement des données
          }, 100);
        },
        error: (err) => {
          console.error('Error loading dashboard data:', err);
          this.isLoading = false;
        }
      });
  }

  // Méthode pour rendre tous les graphiques
  renderCharts(): void {
    this.renderStatusChart(); // Rend le graphique des statuts de réservation
    this.renderPopularRoomsChart(); // Rend le graphique des salles les plus réservées
    this.renderWeekdayChart(); // Rend le graphique des réservations par jour de la semaine
  }

  // Méthode pour rendre le graphique des statuts de réservation
  renderStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approuvé', 'En attente', 'Rejeté', 'Fixe'],
        datasets: [{
          data: [
            this.stats.approvedReservations,
            this.stats.pendingReservations,
            this.stats.rejectedReservations,
            this.stats.fixedReservations
          ],
          backgroundColor: [
            '#10B981', // vert pour approuvé
            '#F59E0B', // ambre pour en attente
            '#EF4444', // rouge pour rejeté
            '#6366F1'  // indigo pour fixe
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        cutout: '70%'
      }
    });
    this.charts.push(chart);
  }

  // Méthode pour rendre le graphique des salles les plus réservées
  renderPopularRoomsChart(): void {
    const ctx = document.getElementById('popularRoomsChart') as HTMLCanvasElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stats.mostBookedRooms.map(item => item.local_nom),
        datasets: [{
          label: 'Nombre de réservations',
          data: this.stats.mostBookedRooms.map(item => item.count),
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  // Méthode pour rendre le graphique des réservations par jour de la semaine
  renderWeekdayChart(): void {
    const ctx = document.getElementById('weekdayChart') as HTMLCanvasElement;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.stats.reservationsByDay.map(item => item.day),
        datasets: [{
          label: 'Réservations',
          data: this.stats.reservationsByDay.map(item => item.count),
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#8B5CF6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  // Méthode pour gérer le changement de plage de dates
  onDateRangeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.dateRange = select.value;
    this.loadDashboardData(); // Recharge les données avec la nouvelle plage de dates
  }

  downloadPDF() {
    fetch('http://localhost:8080/api/reservations/pdf')
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'approved_reservations.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(error => console.error('Error downloading PDF:', error));
  }
  

  downloadCSV() {
    fetch('http://localhost:8080/api/reservations/csv')
      .then(response => response.blob()) // Convert response to a blob
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'approved_reservations.csv'; // Set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch(error => console.error('Error downloading CSV:', error));
  }
  
  
}