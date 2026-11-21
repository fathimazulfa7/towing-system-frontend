import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TowingRequest } from '../models/towing-request';

@Injectable({
  providedIn: 'root',
})
export class TowingService {
  private apiUrl = 'http://localhost:9099/api/towing-requests';
  
  // HTTP Headers with CORS support
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.checkBackendConnection();
  }

  /**
   * Check if backend is accessible
   */
  private checkBackendConnection(): void {
    this.http.get(`${this.apiUrl}`, { 
      headers: this.headers,
      responseType: 'json'
    }).pipe(
      catchError(error => {
        console.warn('Backend API is not accessible at:', this.apiUrl);
        console.warn('Error:', error.message);
        return throwError(() => error);
      })
    ).subscribe({
      next: () => console.log('✓ Backend API is accessible'),
      error: (err) => console.warn('⚠ Backend connection check failed:', err.message)
    });
  }

  /**
   * Handle HTTP errors with better messages
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Cannot reach backend server. Ensure it\'s running on http://localhost:8099';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found (404)';
      } else if (error.status === 405) {
        errorMessage = 'Method not allowed (405) - Backend may not support this operation';
      } else if (error.status === 500) {
        errorMessage = 'Server error (500). Check backend logs';
      } else if (error.status) {
        errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      }
      console.error('Server error status:', error.status);
      console.error('Server error statusText:', error.statusText);
      console.error('Server response:', error.error);
    }
    
    console.error('Full error details:', error);
    console.error('Error URL:', error.url);
    return throwError(() => new Error(errorMessage));
  }

  // Get all towing requests
  getAllTowingRequests(): Observable<TowingRequest[]> {
    return this.http.get<TowingRequest[]>(this.apiUrl, { 
      headers: this.headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get a single towing request by ID
  getTowingRequestById(id: number): Observable<TowingRequest> {
    return this.http.get<TowingRequest>(`${this.apiUrl}/${id}`, { 
      headers: this.headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Create a new towing request
  createTowingRequest(request: TowingRequest): Observable<TowingRequest> {
    return this.http.post<TowingRequest>(this.apiUrl, request, { 
      headers: this.headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Update an existing towing request
  updateTowingRequest(id: number, request: TowingRequest): Observable<TowingRequest> {
    return this.http.put<TowingRequest>(`${this.apiUrl}/${id}`, request, { 
      headers: this.headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Delete a towing request
  deleteTowingRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Get towing requests by status
  getTowingRequestsByStatus(status: string): Observable<TowingRequest[]> {
    return this.http.get<TowingRequest[]>(`${this.apiUrl}/status/${status}`, { 
      headers: this.headers 
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
}
