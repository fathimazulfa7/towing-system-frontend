import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TowingService } from '../../services/towing';
import { TowingRequest } from '../../models/towing-request';

@Component({
  selector: 'app-towing-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './towing-form.html',
  styleUrl: './towing-form.css',
})
export class TowingFormComponent implements OnInit {
  towingRequest: TowingRequest = {
    name: '',
    address: '',
    phoneNumber: '',
    requestType: '',
    status: 'PENDING',
    description: ''
  };

  isEditMode = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  requestTypes = ['BREAKDOWN', 'ACCIDENT', 'LOCKED_OUT', 'TIRE_CHANGE', 'FUEL_DELIVERY', 'OTHER'];
  statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  constructor(
    private towingService: TowingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
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

  onSubmit(): void {
    this.error = null;
    this.success = null;

    if (!this.validateForm()) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.towingRequest.id) {
      console.log('=== UPDATING REQUEST ===');
      console.log('ID:', this.towingRequest.id);
      console.log('Request data:', JSON.stringify(this.towingRequest));
      console.log('Sending to:', `http://localhost:9099/api/towing-requests/${this.towingRequest.id}`);
      
      this.towingService.updateTowingRequest(this.towingRequest.id, this.towingRequest).subscribe({
        next: (response) => {
          console.log('✓ Update successful! Response:', response);
          this.success = 'Towing request updated successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/list']), 1500);
        },
        error: (err) => {
          console.error('✗ Update failed!');
          console.error('Error object:', err);
          console.error('Error status:', err.status);
          console.error('Error statusText:', err.statusText);
          console.error('Error message:', err.message);
          console.error('Backend response:', err.error);
          this.error = `Failed to update: ${err.error?.message || err.message || 'Unknown error'}`;
          this.loading = false;
        }
      });
    } else {
      this.towingService.createTowingRequest(this.towingRequest).subscribe({
        next: () => {
          this.success = 'Towing request created successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/list']), 1500);
        },
        error: (err) => {
          this.error = 'Failed to create towing request';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  validateForm(): boolean {
    return !!(
      this.towingRequest.name &&
      this.towingRequest.address &&
      this.towingRequest.phoneNumber &&
      this.towingRequest.requestType &&
      this.towingRequest.description
    );
  }

  onCancel(): void {
    this.router.navigate(['/list']);
  }
}
