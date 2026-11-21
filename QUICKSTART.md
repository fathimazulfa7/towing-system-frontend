# Quick Start Guide - Towing Service Frontend

## Prerequisites

- **Node.js**: v20.19.3 or higher
- **npm**: v10.8.2 or higher
- **Angular CLI**: v20.3.9
- **Backend**: Towing Service API running on `http://localhost:8099`

## Step-by-Step Setup

### 1. Navigate to Project Directory

```powershell
cd towing-service-frontend
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Start Development Server

```powershell
ng serve
```

The application will start at `http://localhost:4200`

### 4. Open in Browser

Navigate to: `http://localhost:4200`

## Default Application Routes

| Route         | Component             | Description                               |
| ------------- | --------------------- | ----------------------------------------- |
| `/list`       | TowingListComponent   | View all towing requests with filters     |
| `/create`     | TowingFormComponent   | Create a new towing request               |
| `/edit/:id`   | TowingFormComponent   | Edit an existing towing request           |
| `/detail/:id` | TowingDetailComponent | View detailed information about a request |

## Features Overview

### 1. Dashboard (List View)

- View all towing requests in a table
- Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- Actions: View Details, Edit, Delete
- Create new request button

### 2. Create Request

- Fill in required fields:
  - Name (customer name)
  - Address (location)
  - Phone Number
  - Request Type (BREAKDOWN, ACCIDENT, LOCKED_OUT, TIRE_CHANGE, FUEL_DELIVERY, OTHER)
  - Description
- Status defaults to PENDING
- Submit or cancel

### 3. Edit Request

- Modify existing request information
- Update status if needed
- Save changes or cancel

### 4. Detail View

- View complete request information
- See creation and update dates
- Edit or delete from this page
- Return to list

## API Endpoints Used

```
Base URL: http://localhost:8099/api

GET    /towing-requests              - Get all requests
GET    /towing-requests/{id}         - Get specific request
GET    /towing-requests/status/{status} - Filter by status
POST   /towing-requests              - Create request
PUT    /towing-requests/{id}         - Update request
DELETE /towing-requests/{id}         - Delete request
```

## Available Commands

### Development Server

```powershell
ng serve
```

Runs the app in development mode. Navigate to `http://localhost:4200/`.

### Build

```powershell
ng build
```

Builds the project in the dist/ directory.

### Production Build

```powershell
ng build --configuration production
```

Optimized production build.

### Watch Mode (Rebuild on Changes)

```powershell
ng build --watch --configuration development
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── towing-detail/
│   │   │   ├── towing-detail.ts
│   │   │   ├── towing-detail.html
│   │   │   └── towing-detail.css
│   │   ├── towing-form/
│   │   │   ├── towing-form.ts
│   │   │   ├── towing-form.html
│   │   │   └── towing-form.css
│   │   └── towing-list/
│   │       ├── towing-list.ts
│   │       ├── towing-list.html
│   │       └── towing-list.css
│   ├── models/
│   │   └── towing-request.ts
│   ├── services/
│   │   └── towing.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── app.ts
│   ├── app.html
│   └── app.css
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── main.ts
├── styles.css
└── index.html
```

## Configuration

### Change Backend API URL

Edit `src/app/services/towing.ts`:

```typescript
private apiUrl = 'http://your-backend-url:8099/api/towing-requests';
```

Or use environment variables in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8099/api',
};
```

## Common Issues & Solutions

### Issue: Backend Connection Fails

**Solution**: Ensure backend API is running on `http://localhost:8099`

### Issue: CORS Errors

**Solution**: Configure CORS on backend or use a proxy

### Issue: Port 4200 Already in Use

**Solution**: Use a different port:

```powershell
ng serve --port 4201
```

### Issue: Module Not Found

**Solution**: Reinstall dependencies:

```powershell
npm install
```

### Issue: Build Fails

**Solution**: Check for TypeScript errors:

```powershell
ng build
```

## Testing the Application

1. **Create a Request**
   - Navigate to `/create`
   - Fill in all required fields
   - Click "Create"

2. **View All Requests**
   - Navigate to `/list`
   - See requests in table format

3. **Filter by Status**
   - On list page, select status from dropdown
   - Table updates automatically

4. **View Details**
   - Click the eye icon (👁️) on any request row
   - See full request details

5. **Edit Request**
   - Click the pencil icon (✏️) on any request row
   - Modify fields and save

6. **Delete Request**
   - Click the trash icon (🗑️) on any request row
   - Confirm deletion

## Deployment

### Build for Production

```powershell
ng build --configuration production
```

### Deploy to Server

1. Copy contents of `dist/towing-service-frontend/` to your web server
2. Configure web server to route all requests to `index.html`
3. Update API URL in configuration for production environment

## Environment Variables

Create a `.env` file (if needed):

```
BACKEND_API_URL=http://localhost:8099/api
PORT=4200
```

## Debugging

### Enable Source Maps

```powershell
ng build --source-map
```

### Use Angular DevTools

- Install Angular DevTools extension in Chrome
- Open DevTools (F12)
- Use Angular tab for component inspection

## Performance Tips

1. **Enable Production Mode**
   - Builds run faster with `--configuration production`
   - Smaller bundle size

2. **Lazy Load Routes** (Future Enhancement)
   - Load components only when needed

3. **OnPush Change Detection** (Future Enhancement)
   - Improve performance for large lists

## Support & Help

For detailed information:

- Check `README_PROJECT.md` for comprehensive documentation
- Review component files for implementation details
- Check console (F12) for error messages
- Verify backend API is running and accessible

## Next Steps

1. Start the development server
2. Navigate to the list page
3. Create a test towing request
4. Test all CRUD operations
5. Verify data persistence

Enjoy using the Towing Service Management System!
