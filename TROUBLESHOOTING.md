# Troubleshooting "Failed to load towing requests" Error

## 🔴 Error Summary

You're seeing "Failed to load towing requests" error. This happens when the Angular frontend cannot communicate with the backend API.

---

## ✅ Step-by-Step Fixes

### **Step 1: Verify Backend is Running**

The #1 cause of this error is the backend API not running.

**Check if backend is running on port 8099:**

```powershell
# Open a new terminal/PowerShell window
# Navigate to your backend directory
cd ../towing-service-backend  # or wherever your backend is

# Check if it's running
# If it's a Spring Boot app with Maven:
mvn spring-boot:run

# Or if it's a JAR file:
java -jar towing-service-backend.jar
```

**You should see output like:**

```
Started TowingServiceApplication in X seconds
Server running on port 8099
```

### **Step 2: Test Backend API Directly**

Open PowerShell and test if the API is accessible:

```powershell
# Test the API endpoint
curl -X GET http://localhost:8099/api/towing-requests
```

**Expected Response:**

```json
[]  # Empty array or array of requests
```

**If you get an error:**

- Backend is not running → Start it (Step 1)
- Wrong port → Backend is on different port (see Step 4)
- CORS issue → See Step 3

### **Step 3: Enable CORS on Backend**

The frontend (port 4200) needs permission to access backend (port 8099). Add CORS configuration to your **Spring Boot backend**:

**File: `src/main/java/com/example/config/CorsConfig.java`** (Create if missing)

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

**Or use annotation on your controller:**

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class TowingRequestController {
    // ... your code
}
```

### **Step 4: Verify API Endpoint URL**

Check if the API endpoint in the frontend matches your backend.

**File:** `src/app/services/towing.ts`

```typescript
private apiUrl = 'http://localhost:8099/api/towing-requests';
```

**Verify:**

- Backend running on port 8099? → Change if different
- API path is `/api/towing-requests`? → Check your backend routes

**To find correct endpoint:**

```powershell
# Test with curl
curl -X GET http://localhost:8099/api/towing-requests

# Try alternate paths if above fails
curl -X GET http://localhost:8099/towing-requests
curl -X GET http://localhost:8099/api/v1/towing-requests
```

### **Step 5: Check Browser Console for Details**

This tells you exactly what's wrong:

**Steps:**

1. Open browser (Chrome/Firefox/Safari)
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for red error messages
5. It will show what went wrong

**Example error messages:**

| Error                                           | Cause               | Fix                      |
| ----------------------------------------------- | ------------------- | ------------------------ |
| `ERR_CONNECTION_REFUSED`                        | Backend not running | Start backend (Step 1)   |
| `CORS policy: No 'Access-Control-Allow-Origin'` | CORS not enabled    | Enable CORS (Step 3)     |
| `404 Not Found`                                 | Wrong API path      | Verify endpoint (Step 4) |
| `503 Service Unavailable`                       | Backend down        | Restart backend          |

### **Step 6: Check Network Tab**

See exactly what request is being made:

**Steps:**

1. Open Developer Tools (F12)
2. Click **Network** tab
3. Reload the page (F5)
4. Look for request to `towing-requests`
5. Click on it to see details

**Check:**

- **Status**: Should be 200 (success)
- **Method**: Should be GET
- **URL**: Should match your endpoint
- **Response**: Should show data or error

---

## 🔧 Checklist

Before reporting an issue, verify:

- [ ] Backend is running on `http://localhost:8099`
- [ ] API endpoint works: `curl http://localhost:8099/api/towing-requests`
- [ ] CORS is enabled on backend
- [ ] Frontend API URL is correct: `http://localhost:8099/api/towing-requests`
- [ ] Browser console shows detailed error message
- [ ] Network tab shows request details
- [ ] No firewall blocking port 8099
- [ ] Port 8099 not used by another application

---

## 🚨 Common Issues & Solutions

### Issue 1: ERR_CONNECTION_REFUSED

**Cause:** Backend not running

**Solution:**

```powershell
# Start your backend
cd ../towing-service-backend
mvn spring-boot:run  # or java -jar *.jar
```

### Issue 2: CORS Error

**Cause:** Backend doesn't allow frontend to access it

**Solution:** Add CORS configuration to backend (see Step 3)

### Issue 3: 404 Not Found

**Cause:** Wrong API path

**Solution:**

1. Check backend controller path
2. Update frontend URL to match
3. Test with curl first

### Issue 4: 500 Internal Server Error

**Cause:** Backend error

**Solution:**

1. Check backend logs for stack trace
2. Verify database is running
3. Check backend configuration

### Issue 5: Empty Response

**Cause:** Requests exist but none in database

**Solution:**

1. This is OK - means API works but no data
2. Create a request using the form
3. Reload the page

---

## 📝 Step-by-Step Complete Fix

Follow this exactly:

### Terminal 1: Start Backend

```powershell
cd ../towing-service-backend
mvn spring-boot:run
# Wait for: "Started TowingServiceApplication"
```

### Terminal 2: Test API

```powershell
curl -X GET http://localhost:8099/api/towing-requests
# Should return: []
```

### Terminal 3: Start Frontend

```powershell
cd ../towing-service-frontend/towing-service-frontend
ng serve
# Wait for: "Application bundle generation complete"
```

### Browser: Test App

```
1. Open: http://localhost:4200
2. Press F12 to open console
3. Check for any errors
4. Reload page if needed
5. Try creating a request
```

---

## 🎯 What to Check if Still Not Working

1. **Backend Terminal**
   - Any error messages?
   - Is it showing port 8099?

2. **Browser Console (F12)**
   - What is the exact error?
   - Copy the full error message

3. **Browser Network Tab (F12)**
   - What is the request URL?
   - What is the response status?

4. **PowerShell Test**
   ```powershell
   curl -v http://localhost:8099/api/towing-requests
   ```

   - Does this work or fail?

---

## 💡 Additional Tips

### Restart Everything

Sometimes restarting fixes issues:

```powershell
# Kill backend process
# Kill frontend (Ctrl+C in terminal)
# Close browser

# Then restart everything in order:
# 1. Backend
# 2. Frontend
# 3. Browser
```

### Use Different Port

If port 8099 is in use:

**Backend:** Use different port (e.g., 8098)

**Frontend:** Update URL in `src/app/services/towing.ts`

```typescript
private apiUrl = 'http://localhost:8098/api/towing-requests';
```

### Check Port in Use

```powershell
# See what's using port 8099
netstat -ano | findstr :8099
```

### Enable Detailed Logging

**Frontend (Angular):** Already shows detailed errors in console

**Backend (Spring Boot):** Add to `application.properties`

```properties
logging.level.root=DEBUG
logging.level.com.example=DEBUG
```

---

## 📞 Still Not Working?

Share these details:

1. **Exact error message** (from browser console)
2. **Backend running?** (Yes/No)
3. **curl test result** - Works or fails?
4. **Backend logs** - Any error messages?
5. **Network tab status** - What status code?

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ No error message displayed
- ✅ Table shows "Loading..." then data appears
- ✅ Browser console shows "✓ Successfully loaded requests"
- ✅ Can create, edit, view, and delete requests
- ✅ Filter by status works
- ✅ No red errors in console

---

## 🎉 Done!

Once you see the requests loading, the error is fixed!

If requests don't appear:

1. Backend may have no data
2. Create a test request using the form
3. Reload page
4. Should appear in the list

---

**Good luck! The error is fixable with these steps.** 🚀
