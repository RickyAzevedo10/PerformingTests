# 🧪 Performance Tests — Monolithic vs Microservices Architecture
This repository contains the scripts and results used to perform **performance, cost, and scalability tests** on two different .NET applications:  
a **monolithic architecture** and its **migrated microservices version**.

These tests were conducted as part of the master’s dissertation titled:  
> **"Differences in Performance, Scalability, and Costs When Using Monolithic and Microservices Architectures"**

---

## 🧰 Some Technologies Used
- **.NET** (Monolithic and Microservices APIs)  
- **Grafana k6** — performance testing tool  
- **Grafana** — monitoring and visualization of results  
- **Docker** — service orchestration during testing  
- **SQL Server** — database used in both architectures  

---

## 🧾 Repository Structure
📂 Results Monolith/
- ┣ 📸 Contains screenshots of performance test results for the monolithic architecture

📂 Results Microservices/
- ┣ 📸 Contains screenshots of performance test results for the microservices architecture

📄 monolith-performance.js
- ┣ Grafana k6 performance test script for the monolithic application

📄 microservices-performance.js
- ┣ Grafana k6 performance test script for the microservices application

📄 README.md
- ┣ This documentation file

---

## ⚙️ Test Description
The performance tests were conducted using **Grafana k6**, aiming to compare both architectures under different load conditions.

The key metrics analyzed were:
- **Latency (Response Time):** average response time of the APIs  
- **Throughput (Requests per Second):** number of requests handled per second  
- **Scalability:** system behavior as the number of users and data volume increased  

All tests were executed under controlled and equivalent conditions between the two architectures to ensure fair and consistent comparisons.

---

## 📊 Results
The performance test results can be found in the following directories:
- `Results Monolith/` — results obtained from the monolithic architecture  
- `Results Microservices/` — results obtained from the microservices architecture  

Each folder contains **Grafana dashboard screenshots**, representing the measured metrics during the performance tests.

---

## 🚀 Running the Tests (Optional)
To rerun the performance tests, you can use the included k6 scripts:

```bash
# Run the monolithic test
k6 run monolith-performance.js

# Run the microservices test
k6 run microservices-performance.js
```

⚠️ Ensure that k6 is installed and both .NET applications are running before executing the tests.
