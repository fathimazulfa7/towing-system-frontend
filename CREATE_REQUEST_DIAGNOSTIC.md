# 🔍 CREATE REQUEST - Diagnostic Guide

## Quick Diagnosis (5 minutes)

### Step 1: Check if Backend is Running

```powershell
curl -X GET http://localhost:8099/api/towing-requests
```

**If you see:**

- `[]` or `[{...}]` → ✅ Backend running
- Connection refused → ❌ Start backend first
- CORS error → ❌ Add CORS config

### Step 2: Test POST Directly

```powershell
curl -X POST http://localhost:8099/api/towing-requests `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","address":"123 St","phoneNumber":"555-1234","requestType":"BREAKDOWN","status":"PENDING","description":"Test"}'
```

**If you see:**

- `201 Created` with data → ✅ Backend works, frontend issue
- `404 Not Found` → ❌ POST endpoint missing
- `400 Bad Request` → ❌ Field mismatch
- `500 Server Error` → ❌ Database or code error
- CORS error → ❌ CORS not enabled

### Step 3: Check Backend Logs

Look for errors in your backend terminal:

```
[ERROR] org.springframework...
[WARN] ...
SQLException...
```

---

## 🎯 Most Likely Issues (In Order)

### Issue #1: Missing @PostMapping (60% chance)

**Fix:** Add this to your controller:

```java
@PostMapping
public ResponseEntity<TowingRequest> createRequest(@RequestBody TowingRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(repository.save(request));
}
```

### Issue #2: Field Name Mismatch (25% chance)

**Frontend sends:**

```
name, address, phoneNumber, requestType, status, description
```

**Your entity must have same names!**

**Check:** Are your Java field names exactly matching?

```java
private String name;           // ✅ CORRECT
private String phonenumber;    // ❌ WRONG (no camelCase)
private String request_type;   // ❌ WRONG (uses underscore)
```

### Issue #3: Database Connection (10% chance)

**Check application.properties:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/towing_service
spring.datasource.username=root
spring.datasource.password=yourPassword
```

**Verify:**

- [ ] MySQL is running
- [ ] Database exists
- [ ] Credentials correct
- [ ] Port is correct

### Issue #4: CORS Configuration (5% chance)

**Check if you have:**

```java
@Configuration
public class CorsConfig { ... }
```

OR

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class TowingRequestController { ... }
```

---

## 🧪 Step-by-Step Testing

### Test 1: Backend Responds

```powershell
# Should return [] or [{...}]
curl http://localhost:8099/api/towing-requests
```

✅ Passes → Continue to Test 2
❌ Fails → Backend not running or wrong port

### Test 2: POST Endpoint Exists

```powershell
# Should return 201 or 400, NOT 404
curl -X POST http://localhost:8099/api/towing-requests `
  -H "Content-Type: application/json" `
  -d '{}'
```

✅ Passes (even with empty body) → Continue to Test 3
❌ Fails with 404 → Add @PostMapping to controller

### Test 3: Full POST with Data

```powershell
curl -X POST http://localhost:8099/api/towing-requests `
  -H "Content-Type: application/json" `
  -d '{
    "name": "John",
    "address": "123 St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "PENDING",
    "description": "Test"
  }'
```

✅ Passes with 201 + data → Backend works!
❌ Fails with 400 → Field name mismatch
❌ Fails with 500 → Database or code error

### Test 4: Data Persisted

```powershell
# Should show the created request
curl http://localhost:8099/api/towing-requests
```

✅ Shows new data → **Problem solved!**
❌ Empty list → Data wasn't saved

---

## 🛠️ Quick Fixes by Error Type

### 404 Not Found

```java
// ADD THIS to your controller
@PostMapping
public ResponseEntity<TowingRequest> createRequest(@RequestBody TowingRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(request));
}
```

### 400 Bad Request

```java
// FIX: Ensure field names match exactly
// Frontend sends: phoneNumber (camelCase)
// Your entity: private String phoneNumber; ✅
// NOT: private String phonenumber; ❌
```

### 500 Server Error

```
Check backend terminal for error message
Common: "Unknown column" → Fix entity
Common: "SQLException" → Check database connection
```

### CORS Policy Error

```java
// ADD THIS to controller or create CorsConfig class
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/towing-requests")
public class TowingRequestController { ... }
```

---

## 📋 Diagnostic Checklist

### Frontend

- [ ] Form validates (all fields filled)
- [ ] Shows "Success!" message
- [ ] No error message displayed
- [ ] Browser console shows no errors (F12)

### Backend - Code

- [ ] Entity class exists with all fields
- [ ] Repository extends JpaRepository
- [ ] Controller has @PostMapping method
- [ ] Method uses @RequestBody TowingRequest
- [ ] Method returns ResponseEntity or object

### Backend - Config

- [ ] application.properties exists
- [ ] Database URL correct
- [ ] Username/password correct
- [ ] CORS configuration added

### Backend - Database

- [ ] MySQL running
- [ ] Database created
- [ ] JPA creates tables (check ddl-auto)
- [ ] Connection successful

### Testing

- [ ] GET /api/towing-requests returns []
- [ ] POST /api/towing-requests returns 201
- [ ] GET again shows created data
- [ ] Frontend creates request successfully

---

## 🎯 Decision Tree

```
Trying to create request from frontend...

└─ Does "Success!" message appear?
   ├─ YES → Go to Step 2
   └─ NO → Check frontend form validation
           └─ All fields filled?
              ├─ YES → Check browser console (F12)
              └─ NO → Fill in all fields

Step 2: Check browser console (F12)
└─ Any error messages?
   ├─ "404 Not Found" → Add @PostMapping to controller
   ├─ "400 Bad Request" → Check field names match
   ├─ "500 Server Error" → Check backend logs
   ├─ "CORS policy" → Add CORS configuration
   └─ NO errors → Check if data in database

Step 3: Test backend directly
curl -X POST http://localhost:8099/api/towing-requests \
  -H "Content-Type: application/json" \
  -d '{...}'

└─ What's the response?
   ├─ 201 Created → Backend works, frontend issue
   ├─ 404 → Add POST endpoint
   ├─ 400 → Fix field names
   ├─ 500 → Fix code or database
   └─ Connection error → Start backend

Step 4: Check database
SELECT * FROM towing_requests;

└─ Is data there?
   ├─ YES → All working! ✅
   └─ NO → Data wasn't saved (check logs)
```

---

## 📞 Get Help Fast

### What to Share

1. **Backend error log** (exact error message)
2. **Entity class** (field definitions)
3. **Controller code** (your POST method)
4. **curl response** (what you got back)
5. **application.properties** (database config)

### Example Sharing:

"I ran curl -X POST and got: `400 Bad Request`

My entity has:

```java
private String phoneNumber;
private String requestType;
```

And my controller has:

````java
@PostMapping
public TowingRequest create(@RequestBody TowingRequest req) {
    return repo.save(req);
}
```"

---

## 🚀 Next Steps

1. **Run Test 1:** Check if backend responds
2. **Run Test 2:** Check if POST endpoint exists
3. **Run Test 3:** Send full data
4. **Run Test 4:** Verify data saved

All tests pass? **Congratulations!** ✅

Any test fails? Use the fix guide above for that error type.

---

**Diagnostic Guide:** Complete
**Time to diagnose:** 5 minutes
**Time to fix:** 10-30 minutes (depending on issue)
````
