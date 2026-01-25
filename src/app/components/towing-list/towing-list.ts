import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TowingService } from '../../services/towing';
import { TowingRequest } from '../../models/towing-request';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-towing-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './towing-list.html',
  styleUrl: './towing-list.css',
})
export class TowingListComponent implements OnInit, OnDestroy {
  allRequests: TowingRequest[] = [];
  paginatedRequests: TowingRequest[] = [];
  loading = false;
  error: string | null = null;
  selectedStatus = 'ALL';
  statuses = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private towingService: TowingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTowingRequests();
    
    // Reload data whenever user navigates back to the list
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter((event: any) => event.urlAfterRedirects === '/list'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('ℹ Navigated to list, reloading data...');
        this.loadTowingRequests();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTowingRequests(): void {
    this.loading = true;
    this.error = null;
    this.currentPage = 1; // Reset to first page

    if (this.selectedStatus === 'ALL') {
      this.towingService.getAllTowingRequests().subscribe({
        next: (data) => {
          this.allRequests = data;
          this.totalItems = data.length;
          this.updatePagination();
          this.loading = false;
          console.log('✓ Successfully loaded requests:', data);
        },
        error: (err) => {
          const errorMsg = err.message || 'Failed to load towing requests';
          this.error = errorMsg;
          console.error('❌ Error loading requests:', err);
          this.loading = false;
        }
      });
    } else {
      this.towingService.getTowingRequestsByStatus(this.selectedStatus).subscribe({
        next: (data) => {
          this.allRequests = data;
          this.totalItems = data.length;
          this.updatePagination();
          this.loading = false;
          console.log('✓ Successfully loaded filtered requests:', data);
        },
        error: (err) => {
          const errorMsg = err.message || 'Failed to load towing requests';
          this.error = errorMsg;
          console.error('❌ Error loading filtered requests:', err);
          this.loading = false;
        }
      });
    }
  }

  updatePagination(): void {
    // Calculate total pages
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // Get paginated data
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRequests = this.allRequests.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  viewDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/detail', id]);
    }
  }

  editRequest(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/edit', id]);
    }
  }

  deleteRequest(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this towing request?')) {
      this.towingService.deleteTowingRequest(id).subscribe({
        next: () => {
          this.loadTowingRequests();
        },
        error: (err) => {
          alert('Failed to delete towing request');
          console.error(err);
        }
      });
    }
  }

  onStatusChange(): void {
    this.loadTowingRequests();
  }

  createNew(): void {
    this.router.navigate(['/create']);
  }
}
