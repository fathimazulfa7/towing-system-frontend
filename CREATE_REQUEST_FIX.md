# 🔧 CREATE REQUEST NOT WORKING - Backend Diagnostic & Fix Guide

## ❌ Problem

New requests are not being created in the Spring Boot backend application.

### Symptoms

- Form submits successfully (shows "Success!" message)
- No error message displayed
- Data doesn't appear on dashboard
- No data in database

---

## 🔍 Root Causes (Check These)

### 1. **Missing POST Endpoint in Controller** ⚠️

**Check if your Spring Boot controller has:**

```java
@PostMapping
public ResponseEntity<TowingRequest> createTowingRequest(
    @RequestBody TowingRequest request
) {
    TowingRequest savedRequest = towingRequestRepository.save(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
}
```

**If missing:** This is your problem! ← FIX #1

---

### 2. **Wrong Request Payload Fields** ⚠️

**Frontend sends:**

```json
{
  "name": "John Smith",
  "address": "123 Main St",
  "phoneNumber": "555-1234",
  "requestType": "BREAKDOWN",
  "status": "PENDING",
  "description": "Car won't start"
}
```

**Your entity must have these exact fields (or with @JsonProperty mapping):**

```java
@Entity
public class TowingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String phoneNumber;
    private String requestType;
    private String status;
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    // Constructor, getters, setters
}
```

**If field names don't match:** This is your problem! ← FIX #2

---

### 3. **Missing or Wrong Repository** ⚠️

**Check that you have:**

```java
@Repository
public interface TowingRequestRepository extends JpaRepository<TowingRequest, Long> {
    // JpaRepository provides save() automatically
}
```

**If missing:** This is your problem! ← FIX #3

---

### 4. **Missing Service Layer** ⚠️

**Best practice (optional but recommended):**

```java
@Service
public class TowingRequestService {
    @Autowired
    private TowingRequestRepository repository;

    public TowingRequest createTowingRequest(TowingRequest request) {
        // Add business logic here if needed
        return repository.save(request);
    }
}
```

---

### 5. **Database Configuration Issues** ⚠️

**Check application.properties:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/towing_service
spring.datasource.username=root
spring.datasource.password=yourPassword
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

**Or application.yml:**

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/towing_service
    username: root
    password: yourPassword
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
```

---

### 6. **CORS Not Configured** ⚠️

**If you see CORS error in browser console:**

Add this to your backend:

```java
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

---

## 📋 Complete Backend Setup (Copy-Paste Ready)

### Step 1: Entity Class

**File:** `src/main/java/com/example/model/TowingRequest.java`

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

    // Getters and Setters
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

### Step 2: Repository Interface

**File:** `src/main/java/com/example/repository/TowingRequestRepository.java`

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

### Step 3: Service Class

**File:** `src/main/java/com/example/service/TowingRequestService.java`

```java
package com.example.service;

import com.example.model.TowingRequest;
import com.example.repository.TowingRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TowingRequestService {

    @Autowired
    private TowingRequestRepository repository;

    public List<TowingRequest> getAllRequests() {
        return repository.findAll();
    }

    public Optional<TowingRequest> getRequestById(Long id) {
        return repository.findById(id);
    }

    public TowingRequest createRequest(TowingRequest request) {
        return repository.save(request);
    }

    public TowingRequest updateRequest(Long id, TowingRequest request) {
        Optional<TowingRequest> existing = repository.findById(id);
        if (existing.isPresent()) {
            TowingRequest updated = existing.get();
            updated.setName(request.getName());
            updated.setAddress(request.getAddress());
            updated.setPhoneNumber(request.getPhoneNumber());
            updated.setRequestType(request.getRequestType());
            updated.setStatus(request.getStatus());
            updated.setDescription(request.getDescription());
            return repository.save(updated);
        }
        return null;
    }

    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public List<TowingRequest> getRequestsByStatus(String status) {
        return repository.findByStatus(status);
    }
}
```

### Step 4: REST Controller

**File:** `src/main/java/com/example/controller/TowingRequestController.java`

```java
package com.example.controller;

import com.example.model.TowingRequest;
import com.example.service.TowingRequestService;
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
    private TowingRequestService service;

    // GET all requests
    @GetMapping
    public ResponseEntity<List<TowingRequest>> getAllRequests() {
        List<TowingRequest> requests = service.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    // GET single request
    @GetMapping("/{id}")
    public ResponseEntity<TowingRequest> getRequestById(@PathVariable Long id) {
        Optional<TowingRequest> request = service.getRequestById(id);
        return request.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // CREATE request ← THIS IS THE IMPORTANT ONE
    @PostMapping
    public ResponseEntity<TowingRequest> createRequest(@RequestBody TowingRequest request) {
        try {
            TowingRequest saved = service.createRequest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("Error creating request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // UPDATE request
    @PutMapping("/{id}")
    public ResponseEntity<TowingRequest> updateRequest(
            @PathVariable Long id,
            @RequestBody TowingRequest request) {
        TowingRequest updated = service.updateRequest(id, request);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        service.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    // GET by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TowingRequest>> getByStatus(@PathVariable String status) {
        List<TowingRequest> requests = service.getRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }
}
```

### Step 5: CORS Configuration

**File:** `src/main/java/com/example/config/CorsConfig.java`

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

### Step 6: Database Configuration

**File:** `application.properties`

```properties
# Server Port
server.port=8099

# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/towing_service
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Application Name
spring.application.name=towing-service
```

**Or application.yml:**

```yaml
server:
  port: 8099

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/towing_service
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  application:
    name: towing-service
```

---

## 🧪 Test the Backend

### Test 1: GET (Verify Backend is Running)

```bash
curl -X GET http://localhost:8099/api/towing-requests
```

**Expected Response:**

```json
[]
```

### Test 2: POST (Create Request)

```bash
curl -X POST http://localhost:8099/api/towing-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "address": "123 Main St",
    "phoneNumber": "555-1234",
    "requestType": "BREAKDOWN",
    "status": "PENDING",
    "description": "Car won'"'"'t start"
  }'
```

**Expected Response (201 Created):**

```json
{
  "id": 1,
  "name": "John Smith",
  "address": "123 Main St",
  "phoneNumber": "555-1234",
  "requestType": "BREAKDOWN",
  "status": "PENDING",
  "description": "Car won't start",
  "createdDate": "2026-01-25T03:30:00.000+00:00",
  "updatedDate": "2026-01-25T03:30:00.000+00:00"
}
```

### Test 3: GET Again (Verify Data was Created)

```bash
curl -X GET http://localhost:8099/api/towing-requests
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "name": "John Smith",
    ...
  }
]
```

---

## ✅ Verification Checklist

### Backend Setup

- [ ] Entity class created with all fields
- [ ] Repository interface extends JpaRepository
- [ ] Service class with CRUD methods
- [ ] Controller with @PostMapping endpoint
- [ ] CORS configuration added
- [ ] Database properties configured
- [ ] Maven dependencies included (see below)

### Maven Dependencies

Ensure your `pom.xml` has:

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Spring Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Lombok (optional) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

### Database

- [ ] MySQL installed and running
- [ ] Database `towing_service` created (or let JPA create it)
- [ ] Correct credentials in application.properties

### Testing Flow

- [ ] Backend starts: `mvn spring-boot:run`
- [ ] API responds: `curl http://localhost:8099/api/towing-requests`
- [ ] POST works: `curl -X POST ... -d '...'`
- [ ] Data persisted: Second GET shows created data
- [ ] Frontend creates request: Form → Submit → Data appears

---

## 🚀 Implementation Steps

1. **Update Entity class** - Ensure all fields match frontend
2. **Create/Update Repository** - Extends JpaRepository
3. **Create/Update Service** - Add business logic
4. **Create/Update Controller** - Add @PostMapping for create
5. **Add CORS config** - Enable cross-origin requests
6. **Update application.properties** - Database connection
7. **Add Maven dependencies** - If missing
8. **Restart backend** - `mvn spring-boot:run`
9. **Test with curl** - Verify POST works
10. **Test from frontend** - Create request should work

---

## 🐛 Common Issues & Solutions

| Issue              | Cause                | Solution                       |
| ------------------ | -------------------- | ------------------------------ |
| 404 Not Found      | No POST endpoint     | Add @PostMapping to controller |
| 400 Bad Request    | Field mismatch       | Check entity field names       |
| 500 Server Error   | Database issue       | Check MySQL connection         |
| CORS Error         | No CORS config       | Add CorsConfig class           |
| No data appears    | Save failed silently | Add try/catch and logging      |
| Connection refused | Backend not running  | Start with mvn spring-boot:run |

---

## 📝 Log Analysis

Check backend logs for errors:

```
[ERROR] org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver
  - Resolved exception caused by Handler execution: org.springframework.http.converter.HttpMessageNotReadableException
```

This means the request body couldn't be parsed - check field names!

```
[ERROR] java.sql.SQLException: Unknown column 'x' in 'field list'
```

This means your entity field doesn't exist in database - check entity definition!

---

## ✨ Next Steps

1. **Copy the code above** into your backend
2. **Check package names** - Change `com.example` to your package
3. **Restart backend**
4. **Test with curl first**
5. **Then test from frontend**
6. **Data should now be created!** ✅

---

**Status:** Backend setup guide complete  
**Date:** January 25, 2026  
**Next:** Implement the backend changes and test!
