# Towing Service Frontend - Angular Application

A complete Angular application for managing towing service requests. This frontend consumes REST API endpoints from the towing-service backend and provides a user interface for creating, reading, updating, and deleting (CRUD) towing requests.

## Features

- **Dashboard/List View**: Display all towing requests with filtering by status
- **Create Request**: Form to create new towing service requests
- **Edit Request**: Update existing towing request details
- **Detail View**: View complete details of a specific request
- **Status Management**: Track requests through different statuses (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages for API failures
- **Type-Safe**: Built with TypeScript for better code quality

## Technology Stack

- **Angular**: 20.3.9 (Standalone Components)
- **TypeScript**: Latest version
- **HTML5 & CSS3**: Modern web standards
- **HttpClient**: For REST API communication
- **Angular Router**: For navigation between views
- **Reactive Forms**: For form handling

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── towing-detail/      # Display single request details
│   │   ├── towing-form/        # Create/Edit request form
│   │   └── towing-list/        # List all requests
│   ├── models/
│   │   └── towing-request.ts   # TowingRequest interface
│   ├── services/
│   │   └── towing.ts           # API service
│   ├── app.routes.ts           # Application routes
│   ├── app.config.ts           # App configuration
│   ├── app.ts                  # Root component
│   ├── app.html                # Root template
│   └── app.css                 # App styles
├── main.ts                     # Application entry point
├── styles.css                  # Global styles
└── index.html                  # HTML entry point
```

## Backend API Requirements

The application expects the backend API to be running on `http://localhost:8099` with the following endpoints:

### Endpoints

- `GET /api/towing-requests` - Get all towing requests
- `GET /api/towing-requests/{id}` - Get a specific towing request
- `POST /api/towing-requests` - Create a new towing request
- `PUT /api/towing-requests/{id}` - Update a towing request
- `DELETE /api/towing-requests/{id}` - Delete a towing request
- `GET /api/towing-requests/status/{status}` - Get requests by status

### TowingRequest Model

```typescript
{
  id?: number;
  name: string;
  address: string;
  phoneNumber: string;
  requestType: string;
  status: string;
  description: string;
  createdDate?: Date;
  updatedDate?: Date;
}
```

## Installation & Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Development Server**

   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/`

3. **Build for Production**
   ```bash
   ng build --configuration production
   ```

## Running the Application

### Development Mode

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`

### Production Build

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Available Routes

- `/list` - Dashboard with all towing requests
- `/create` - Form to create a new towing request
- `/edit/:id` - Form to edit an existing towing request
- `/detail/:id` - View details of a specific towing request

## Components

### TowingListComponent

Displays all towing requests in a table format with:

- Status filtering
- View, Edit, and Delete actions
- Quick access to create new requests

### TowingFormComponent

Provides a form for creating and editing towing requests:

- Input validation
- Error and success messages
- Cancel option to return to list

### TowingDetailComponent

Shows complete details of a towing request:

- All request information
- Edit and Delete actions
- Back to list navigation

## Services

### TowingService

Handles all API communication:

- `getAllTowingRequests()` - Fetch all requests
- `getTowingRequestById(id)` - Fetch single request
- `createTowingRequest(request)` - Create new request
- `updateTowingRequest(id, request)` - Update request
- `deleteTowingRequest(id)` - Delete request
- `getTowingRequestsByStatus(status)` - Filter by status

## Styling

The application uses CSS for styling with:

- Responsive design using CSS Grid and Flexbox
- Color-coded status badges
- Professional UI components
- Mobile-friendly layouts

## Error Handling

- API errors display user-friendly messages
- Loading states prevent multiple submissions
- Form validation ensures required fields are filled
- Confirmation dialogs for destructive actions

## Configuration

To change the backend API URL, update the `apiUrl` in `src/app/services/towing.ts`:

```typescript
private apiUrl = 'http://localhost:8099/api/towing-requests';
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tools

- **Angular CLI**: 20.3.9
- **Node.js**: 20.19.3
- **npm**: 10.8.2

## Performance Optimization

- Lazy loading routes (can be implemented)
- Standalone components (tree-shakable)
- OnPush change detection (can be added)
- Production build with optimization

## Security Considerations

- Input validation on forms
- CORS configuration on backend
- Type-safe API interactions
- Secure HTTP headers (configured on backend)

## Troubleshooting

### Port Already in Use

```bash
ng serve --port 4201
```

### API Connection Issues

- Ensure backend is running on `http://localhost:8099`
- Check browser console for CORS errors
- Verify backend CORS configuration

### Module Not Found Errors

```bash
npm install
```

## Future Enhancements

- Add pagination for large datasets
- Implement real-time updates with WebSocket
- Add advanced filtering and search
- Export data to CSV/PDF
- User authentication and authorization
- Dark mode theme
- Service worker for offline support
- Unit and E2E testing

## Contributing

When making changes:

1. Follow Angular style guide
2. Ensure components are reusable
3. Add error handling for all API calls
4. Update documentation
5. Test all changes

## License

This project is part of the Towing Service Management System.

## Support

For issues or questions:

1. Check the backend API documentation
2. Verify backend is running
3. Check browser console for error messages
4. Review component TypeScript files for implementation details
