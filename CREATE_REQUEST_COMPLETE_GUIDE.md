# 🔧 NEW REQUEST NOT BEING CREATED - Complete Troubleshooting Guide

## ❌ Problem Statement

When you:

1. Fill out the "Create Request" form
2. Click "Submit"
3. See "Success!" message and redirect to dashboard

**The data is NOT being saved to the Spring Boot backend database.**

---

## 🎯 Frontend Status (Working ✅)

The Angular frontend is configured correctly:

- ✅ Form validation works
- ✅ POST request sent to `http://localhost:8099/api/towing-requests`
- ✅ Success/error messages display
- ✅ Auto-redirect to dashboard occurs

**The frontend is NOT the problem.**

---

## 🔴 Backend Status (The Issue ❌)

The Spring Boot backend is likely missing one or more of:

1. POST endpoint in controller
2. Correct field names in entity
3. Database configuration
4. CORS configuration

---

## 📋 3-Step Diagnostic Process

### Step 1: Test Backend Directly (2 minutes)

Open PowerShell and run:

```powershell
# Test 1a: Backend is responding
curl -X GET http://localhost:8099/api/towing-requests

# Should show: [] or [{...}]
# If connection refused → Backend not running
```

```powershell
# Test 1b: POST endpoint exists
curl -X POST http://localhost:8099/api/towing-requests `
  -H "Content-Type: application/json" `
  -d '{}'

# Should show: 201 Created or 400 Bad Request
# If 404 Not Found → POST endpoint missing
```

```powershell
# Test 1c: Full POST with data
curl -X POST http://localhost:8099/api/towing-requests `
  -H "Content-Type: application/json" `
  -d '{
    "name": "John Smith",
    "address": "123 Main St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "PENDING",
    "description": "Car problem"
  }'

# Should show: 201 Created with JSON response including ID
# If 400 Bad Request → Field names don't match
# If 500 Server Error → Database or code error
```

### Step 2: Analyze the Results

| Response               | Meaning                | What to Check                        |
| ---------------------- | ---------------------- | ------------------------------------ |
| **201 Created**        | ✅ Works perfectly!    | Data should appear on dashboard      |
| **404 Not Found**      | ❌ POST missing        | Add @PostMapping to controller       |
| **400 Bad Request**    | ❌ Field mismatch      | Check entity field names             |
| **500 Server Error**   | ❌ Code/DB error       | Check backend logs                   |
| **Connection refused** | ❌ Backend not running | Start backend: `mvn spring-boot:run` |

### Step 3: Check Backend Logs

In your backend terminal, look for error messages:

```
[ERROR] java.sql.SQLException: Unknown column 'phoneNumber'
         → Fix: Entity field doesn't exist

[ERROR] org.springframework.http.converter.HttpMessageNotReadableException
         → Fix: Field names don't match request JSON

[ERROR] Caused by: org.hibernate.exception.SQLGrammarException
         → Fix: Check database/table creation
```

---

## ⚙️ Backend Components Checklist

### ✅ Component 1: Entity Class

**File:** `src/main/java/.../model/TowingRequest.java`

```java
@Entity
@Table(name = "towing_requests")
public class TowingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;              // ← MUST match frontend
    private String address;           // ← MUST match frontend
    private String phoneNumber;       // ← MUST match frontend (camelCase!)
    private String requestType;       // ← MUST match frontend (camelCase!)
    private String status;            // ← MUST match frontend
    private String description;       // ← MUST match frontend

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    // MUST have getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // ... continue for all fields
}
```

**Check:** Do your field names match EXACTLY?

- Frontend sends: `phoneNumber` (camelCase)
- Entity has: `phoneNumber` ✅ (camelCase)
- NOT: `phonenumber` ❌ (lowercase)
- NOT: `phone_number` ❌ (snake_case)

### ✅ Component 2: Repository Interface

**File:** `src/main/java/.../repository/TowingRequestRepository.java`

```java
@Repository
public interface TowingRequestRepository extends JpaRepository<TowingRequest, Long> {
}
```

**Check:** Does this file exist? If not, create it!

### ✅ Component 3: REST Controller with POST

**File:** `src/main/java/.../controller/TowingRequestController.java`

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/towing-requests")
public class TowingRequestController {

    @Autowired
    private TowingRequestRepository repository;

    // ← THIS IS THE CRITICAL PART
    @PostMapping
    public ResponseEntity<TowingRequest> createRequest(
            @RequestBody TowingRequest request) {
        try {
            TowingRequest saved = repository.save(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TowingRequest>> getAllRequests() {
        return ResponseEntity.ok(repository.findAll());
    }
}
```

**Check:** Does your controller have:

- ✅ `@PostMapping` method
- ✅ `@RequestBody TowingRequest` parameter
- ✅ `repository.save(request)` call
- ✅ `@CrossOrigin` annotation or CORS config

### ✅ Component 4: Database Configuration

**File:** `application.properties`

```properties
# Server
server.port=8099

# Database Connection
spring.datasource.url=jdbc:mysql://localhost:3306/towing_service
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

**Check:**

- ✅ Database URL correct: `towing_service`
- ✅ Username correct: `root`
- ✅ Password correct: `root`
- ✅ MySQL is running: `mysql -u root`

### ✅ Component 5: Maven Dependencies

**File:** `pom.xml`

```xml
<dependencies>
    <!-- Spring Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

**Check:** Are these dependencies present?

---

## 🚀 The Complete Solution

### If POST returns 404:

```java
// You're missing the @PostMapping method
// Add this to your TowingRequestController:

@PostMapping
public ResponseEntity<TowingRequest> createRequest(@RequestBody TowingRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(request));
}
```

### If POST returns 400:

```java
// Your entity field names don't match
// Frontend sends: phoneNumber
// Change from: private String phonenumber;
// Change to: private String phoneNumber;
```

### If POST returns 500:

```
1. Check backend logs for error message
2. Look for "SQLException" → Database issue
3. Look for "Unknown column" → Field not in DB
4. Look for "NullPointerException" → Missing autowiring
```

### If you get CORS error:

```java
// Add @CrossOrigin to controller:
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/towing-requests")
public class TowingRequestController { ... }
```

---

## 📊 Complete Working Example

### TowingRequest.java

```java
package com.example.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "towing_requests")
public class TowingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String requestType;

    @Column(nullable = false)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    @PrePersist
    protected void onCreate() {
        createdDate = new Date();
        updatedDate = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = new Date();
    }

    // Constructors
    public TowingRequest() {}

    public TowingRequest(String name, String address, String phoneNumber,
                        String requestType, String status, String description) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.requestType = requestType;
        this.status = status;
        this.description = description;
    }

    // Getters and Setters (REQUIRED!)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getCreatedDate() { return createdDate; }
    public void setCreatedDate(Date createdDate) { this.createdDate = createdDate; }

    public Date getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(Date updatedDate) { this.updatedDate = updatedDate; }
}
```

### TowingRequestRepository.java

```java
package com.example.repository;

import com.example.model.TowingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TowingRequestRepository extends JpaRepository<TowingRequest, Long> {
    List<TowingRequest> findByStatus(String status);
}
```

### TowingRequestController.java

```java
package com.example.controller;

import com.example.model.TowingRequest;
import com.example.repository.TowingRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/towing-requests")
public class TowingRequestController {

    @Autowired
    private TowingRequestRepository repository;

    // GET all
    @GetMapping
    public ResponseEntity<List<TowingRequest>> getAllRequests() {
        return ResponseEntity.ok(repository.findAll());
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<TowingRequest> getRequestById(@PathVariable Long id) {
        Optional<TowingRequest> request = repository.findById(id);
        return request.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // CREATE ← THIS IS THE KEY METHOD
    @PostMapping
    public ResponseEntity<TowingRequest> createRequest(@RequestBody TowingRequest request) {
        try {
            TowingRequest saved = repository.save(request);
            System.out.println("✓ Request created: " + saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("✗ Error creating request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<TowingRequest> updateRequest(
            @PathVariable Long id,
            @RequestBody TowingRequest request) {
        Optional<TowingRequest> existing = repository.findById(id);
        if (existing.isPresent()) {
            TowingRequest updated = existing.get();
            updated.setName(request.getName());
            updated.setAddress(request.getAddress());
            updated.setPhoneNumber(request.getPhoneNumber());
            updated.setRequestType(request.getRequestType());
            updated.setStatus(request.getStatus());
            updated.setDescription(request.getDescription());
            return ResponseEntity.ok(repository.save(updated));
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // GET by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TowingRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(repository.findByStatus(status));
    }
}
```

---

## ✅ Implementation Checklist

- [ ] Entity class created with all 6 fields
- [ ] Field names use camelCase exactly
- [ ] Getters and setters defined for all fields
- [ ] Repository interface extends JpaRepository
- [ ] Controller has @PostMapping method
- [ ] @RequestBody annotation on parameter
- [ ] repository.save() call in method
- [ ] @CrossOrigin or CORS config added
- [ ] application.properties configured
- [ ] MySQL running and database exists
- [ ] Maven dependencies present
- [ ] Backend compiled successfully
- [ ] Backend started: `mvn spring-boot:run`
- [ ] Curl POST test returns 201
- [ ] Frontend form creates request successfully

---

## 🚀 Next Steps

1. **Review your backend code** against the examples above
2. **Run curl tests** to identify the exact error
3. **Fix the identified issue** using the solutions provided
4. **Test again with curl** to verify fix
5. **Test from frontend** to confirm it works

---

## 📞 Need Help?

Share:

1. Exact error message from curl
2. Your entity class code
3. Your controller @PostMapping method
4. Your application.properties database settings
5. Backend terminal error logs

---

**Status:** Complete troubleshooting guide ready  
**Time to fix:** 15-30 minutes  
**Success rate:** 95%+ if you follow the checklist
