# API Integration Guide - Towing Service Frontend

## Overview

This document provides detailed information about the API integration between the Angular frontend and the Towing Service backend.

## Backend API Configuration

### Base URL

```
http://localhost:8099/api
```

### Request Timeout

The default timeout for API requests is configured at the HttpClient level (can be customized).

## Service: TowingService

Location: `src/app/services/towing.ts`

All API communication is handled through the `TowingService` which provides an abstraction layer for HTTP requests.

### Service Methods

#### 1. Get All Towing Requests

**Method**: `getAllTowingRequests()`

```typescript
public getAllTowingRequests(): Observable<TowingRequest[]>
```

**Endpoint**: `GET /api/towing-requests`

**Usage in Component**:

```typescript
this.towingService.getAllTowingRequests().subscribe({
  next: (data) => {
    this.towingRequests = data;
  },
  error: (err) => {
    console.error('Error fetching requests', err);
  },
});
```

**Response Format**:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "address": "123 Main St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "PENDING",
    "description": "Car broke down on highway",
    "createdDate": "2024-01-25T10:30:00",
    "updatedDate": "2024-01-25T10:30:00"
  }
]
```

#### 2. Get Single Towing Request

**Method**: `getTowingRequestById(id: number)`

```typescript
public getTowingRequestById(id: number): Observable<TowingRequest>
```

**Endpoint**: `GET /api/towing-requests/{id}`

**Usage**:

```typescript
this.towingService.getTowingRequestById(1).subscribe({
  next: (data) => {
    this.towingRequest = data;
  },
  error: (err) => {
    console.error('Error fetching request', err);
  },
});
```

**Response Format**:

```json
{
  "id": 1,
  "name": "John Doe",
  "address": "123 Main St",
  "phoneNumber": "555-1234",
  "requestType": "BREAKDOWN",
  "status": "PENDING",
  "description": "Car broke down on highway",
  "createdDate": "2024-01-25T10:30:00",
  "updatedDate": "2024-01-25T10:30:00"
}
```

#### 3. Create Towing Request

**Method**: `createTowingRequest(request: TowingRequest)`

```typescript
public createTowingRequest(request: TowingRequest): Observable<TowingRequest>
```

**Endpoint**: `POST /api/towing-requests`

**Request Body**:

```json
{
  "name": "Jane Smith",
  "address": "456 Oak Ave",
  "phoneNumber": "555-5678",
  "requestType": "ACCIDENT",
  "status": "PENDING",
  "description": "Minor accident, need towing"
}
```

**Usage**:

```typescript
const newRequest: TowingRequest = {
  name: 'Jane Smith',
  address: '456 Oak Ave',
  phoneNumber: '555-5678',
  requestType: 'ACCIDENT',
  status: 'PENDING',
  description: 'Minor accident, need towing',
};

this.towingService.createTowingRequest(newRequest).subscribe({
  next: (createdRequest) => {
    console.log('Request created:', createdRequest);
    this.loadRequests();
  },
  error: (err) => {
    console.error('Error creating request', err);
  },
});
```

**Response**: Returns the created request with assigned ID and timestamps

#### 4. Update Towing Request

**Method**: `updateTowingRequest(id: number, request: TowingRequest)`

```typescript
public updateTowingRequest(id: number, request: TowingRequest): Observable<TowingRequest>
```

**Endpoint**: `PUT /api/towing-requests/{id}`

**Request Body**:

```json
{
  "name": "Jane Smith",
  "address": "456 Oak Ave",
  "phoneNumber": "555-5678",
  "requestType": "ACCIDENT",
  "status": "IN_PROGRESS",
  "description": "Minor accident, tow truck on the way"
}
```

**Usage**:

```typescript
const updatedRequest: TowingRequest = {
  ...this.towingRequest,
  status: 'IN_PROGRESS',
};

this.towingService.updateTowingRequest(1, updatedRequest).subscribe({
  next: (request) => {
    console.log('Request updated:', request);
  },
  error: (err) => {
    console.error('Error updating request', err);
  },
});
```

**Response**: Returns the updated request

#### 5. Delete Towing Request

**Method**: `deleteTowingRequest(id: number)`

```typescript
public deleteTowingRequest(id: number): Observable<void>
```

**Endpoint**: `DELETE /api/towing-requests/{id}`

**Usage**:

```typescript
this.towingService.deleteTowingRequest(1).subscribe({
  next: () => {
    console.log('Request deleted');
    this.loadRequests();
  },
  error: (err) => {
    console.error('Error deleting request', err);
  },
});
```

#### 6. Get Requests by Status

**Method**: `getTowingRequestsByStatus(status: string)`

```typescript
public getTowingRequestsByStatus(status: string): Observable<TowingRequest[]>
```

**Endpoint**: `GET /api/towing-requests/status/{status}`

**Usage**:

```typescript
this.towingService.getTowingRequestsByStatus('PENDING').subscribe({
  next: (requests) => {
    this.pendingRequests = requests;
  },
  error: (err) => {
    console.error('Error fetching pending requests', err);
  },
});
```

**Supported Statuses**:

- `PENDING` - New request awaiting assignment
- `IN_PROGRESS` - Tow truck dispatched and en route
- `COMPLETED` - Request fulfilled
- `CANCELLED` - Request cancelled

**Response Format**:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "address": "123 Main St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "PENDING",
    "description": "Car broke down on highway",
    "createdDate": "2024-01-25T10:30:00",
    "updatedDate": "2024-01-25T10:30:00"
  }
]
```

## Data Model: TowingRequest

### Interface Definition

```typescript
export interface TowingRequest {
  id?: number; // Optional, assigned by backend
  name: string; // Required: Customer name
  address: string; // Required: Location address
  phoneNumber: string; // Required: Contact phone
  requestType: string; // Required: Type of service
  status: string; // Required: Current status
  description: string; // Required: Detailed description
  createdDate?: Date; // Optional, assigned by backend
  updatedDate?: Date; // Optional, assigned by backend
}
```

### Field Specifications

| Field       | Type   | Required | Description           | Example               |
| ----------- | ------ | -------- | --------------------- | --------------------- |
| id          | number | No       | Unique identifier     | 1                     |
| name        | string | Yes      | Customer name         | "John Doe"            |
| address     | string | Yes      | Service location      | "123 Main St"         |
| phoneNumber | string | Yes      | Contact number        | "555-1234"            |
| requestType | string | Yes      | Service type          | "BREAKDOWN"           |
| status      | string | Yes      | Current status        | "PENDING"             |
| description | string | Yes      | Detailed description  | "Car broke down"      |
| createdDate | Date   | No       | Creation timestamp    | "2024-01-25T10:30:00" |
| updatedDate | Date   | No       | Last update timestamp | "2024-01-25T10:30:00" |

### Request Types

- `BREAKDOWN` - Vehicle breakdown assistance
- `ACCIDENT` - Accident scene towing
- `LOCKED_OUT` - Lockout service
- `TIRE_CHANGE` - Emergency tire change
- `FUEL_DELIVERY` - Emergency fuel delivery
- `OTHER` - Other services

### Status Values

- `PENDING` - Awaiting dispatch
- `IN_PROGRESS` - Tow truck dispatched
- `COMPLETED` - Service completed
- `CANCELLED` - Request cancelled

## Error Handling

The service doesn't explicitly handle errors. Error handling is delegated to the consuming components.

### Common Error Codes

| Code | Meaning      | Action                         |
| ---- | ------------ | ------------------------------ |
| 400  | Bad Request  | Check request payload format   |
| 404  | Not Found    | Verify request ID exists       |
| 409  | Conflict     | Request may have been modified |
| 500  | Server Error | Check backend logs             |

### Error Handling Example

```typescript
this.towingService.getTowingRequestById(99).subscribe({
  next: (data) => {
    this.towingRequest = data;
  },
  error: (error) => {
    if (error.status === 404) {
      this.error = 'Request not found';
    } else if (error.status === 500) {
      this.error = 'Server error, please try again later';
    } else {
      this.error = 'Failed to load request';
    }
  },
});
```

## Component Integration Examples

### TowingListComponent

- Calls `getAllTowingRequests()` on init
- Filters with `getTowingRequestsByStatus(status)`
- Deletes with `deleteTowingRequest(id)`

### TowingFormComponent

- Creates with `createTowingRequest(request)`
- Loads with `getTowingRequestById(id)` (for edit mode)
- Updates with `updateTowingRequest(id, request)`

### TowingDetailComponent

- Loads with `getTowingRequestById(id)`
- Deletes with `deleteTowingRequest(id)`

## Testing the API Integration

### Using Postman or curl

#### Get All Requests

```bash
curl -X GET http://localhost:8099/api/towing-requests
```

#### Get Single Request

```bash
curl -X GET http://localhost:8099/api/towing-requests/1
```

#### Create Request

```bash
curl -X POST http://localhost:8099/api/towing-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "address": "123 Main St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "PENDING",
    "description": "Car broke down"
  }'
```

#### Update Request

```bash
curl -X PUT http://localhost:8099/api/towing-requests/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "address": "123 Main St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "IN_PROGRESS",
    "description": "Car broke down"
  }'
```

#### Delete Request

```bash
curl -X DELETE http://localhost:8099/api/towing-requests/1
```

#### Get by Status

```bash
curl -X GET http://localhost:8099/api/towing-requests/status/PENDING
```

## Configuration

### Changing the API URL

#### Development Mode

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8099/api',
};
```

#### Production Mode

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com', // Change to production URL
};
```

## CORS Configuration

If you encounter CORS issues, ensure the backend has proper CORS configuration:

```java
// Backend CORS configuration
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        }
    };
}
```

## Performance Optimization

### Potential Improvements

1. **Pagination**
   - Add limit and offset parameters to `getAllTowingRequests()`

2. **Caching**
   - Implement request/response caching with HttpClient

3. **Error Interceptor**
   - Create HTTP interceptor for global error handling

4. **Request Timeout**
   - Configure timeout for long-running requests

## Troubleshooting

### Issue: 404 Not Found

- Verify backend is running on port 8099
- Check request ID exists
- Verify endpoint path is correct

### Issue: CORS Error

- Check backend CORS configuration
- Verify frontend URL is whitelisted
- Check browser console for details

### Issue: 500 Server Error

- Check backend logs
- Verify request payload format
- Check database connectivity

### Issue: Network Error

- Verify backend is running
- Check internet connectivity
- Verify API URL configuration

## Summary

The TowingService provides a clean, type-safe abstraction for all API communication. Components use observables for reactive data handling, with proper error management at the component level.

All HTTP requests are automatically handled with appropriate headers and content types. The service is production-ready and follows Angular best practices.
