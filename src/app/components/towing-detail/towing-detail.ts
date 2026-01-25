import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TowingService } from '../../services/towing';
import { TowingRequest } from '../../models/towing-request';

@Component({
  selector: 'app-towing-detail',
  imports: [CommonModule],
  templateUrl: './towing-detail.html',
  styleUrl: './towing-detail.css',
})
export class TowingDetailComponent implements OnInit {
  towingRequest: TowingRequest | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private towingService: TowingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTowingRequest(parseInt(id));
    }
  }

  loadTowingRequest(id: number): void {
    this.loading = true;
    this.towingService.getTowingRequestById(id).subscribe({
      next: (data) => {
        this.towingRequest = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load towing request';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editRequest(): void {
    if (this.towingRequest?.id) {
      this.router.navigate(['/edit', this.towingRequest.id]);
    }
  }

  backToList(): void {
    this.router.navigate(['/list']);
  }

  deleteRequest(): void {
    if (!this.towingRequest?.id) return;

    if (confirm('Are you sure you want to delete this towing request?')) {
      this.towingService.deleteTowingRequest(this.towingRequest.id).subscribe({
        next: () => {
          this.router.navigate(['/list']);
        },
        error: (err) => {
          alert('Failed to delete towing request');
          console.error(err);
        }
      });
    }
  }
}
