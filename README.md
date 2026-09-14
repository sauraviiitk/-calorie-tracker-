# CalorieMate

<div align="center">

![CalorieMate Banner](https://via.placeholder.com/1200x320.png?text=CalorieMate+-+AI-Powered+Nutritional+Intelligence)

**Production-grade, AI-driven personal nutrition and calorie tracking platform with agentic conversational intelligence, multi-modal ingestion, and high-performance async processing.**

[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](#backend-architecture)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#frontend-architecture)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](#frontend-architecture)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](#backend-architecture)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white)](#database-schema)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](#database-schema)
[![Redis](https://img.shields.io/badge/Redis-BullMQ-DC382D?logo=redis&logoColor=white)](#async-task-processing--bullmq-queue)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](#ai-integration--agentic-architecture)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](#frontend-architecture)

</div>

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Security, Hashing & Authentication](#-security-hashing--authentication)
- [Asynchronous Task Processing & BullMQ](#-asynchronous-task-processing--bullmq)
- [Redis Caching & Invalidation Strategy](#-redis-caching--invalidation-strategy)
- [AI Integration & Agentic Architecture](#-ai-integration--agentic-architecture)
- [PDF Generation & Reporting Engine](#-pdf-generation--reporting-engine)
- [Database Schema & Relational Design](#-database-schema--relational-design)
- [API Reference](#-api-reference)
- [Frontend Architecture](#-frontend-architecture)
- [Local Setup & Run Guide](#-local-setup--run-guide)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌟 Project Overview

**CalorieMate** eliminates the friction and cognitive load inherent in traditional manual calorie tracking. By marrying modern web technologies with multi-modal generative AI, CalorieMate allows users to log and monitor their dietary intake seamlessly through **text**, **voice/chat**, **food photographs**, or **PDF food diaries**.

### Core Engineering Objectives
- **Zero-Friction Ingestion**: AI-assisted natural language meal logging and image recognition.
- **Strict Data Isolation**: Tenant-isolated relational PostgreSQL storage governed by verified JWT claims.
- **Resilient Asynchrony**: Offloading heavy AI vision inference and document parsing into Redis-backed worker queues.
- **Idempotent Operations**: Cryptographic SHA-256 fingerprinting to prevent redundant compute and duplicate logs.
- **High-Performance Caching**: Redis caching with automated, non-blocking scan-based invalidation.
- **Client-Side Export**: High-resolution, multi-page vector-accurate PDF generation directly in the browser.

---

## ⚡ Key Features

### 🥗 Nutrition & Meal Tracking
- **Chronological Meal Flow**: Meals are structured in natural chronological order: **Breakfast → Lunch → Snacks → Dinner**.
- **Granular Macro Tracking**: Tracks Calories (kcal), Protein (g), Carbohydrates (g), and Fat (g) with decimal-level precision.
- **Flexible Quantities & Units**: Supports standard measurements (grams, kilograms, milliliters, liters, slices, cups, bowls, servings, tablespoons, teaspoons).
- **"Today Only" Mutation Rule**: Enforces strict historical data integrity: past meal logs are immutable read-only records, preventing retroactive data contamination.

### 🎯 Goal Management & Progress Tracking
- **Global Nutritional Baselines**: Set default daily calorie and macronutrient targets.
- **Date-Specific Overrides**: Schedule specific macro/calorie targets for high-carb days, refeeds, or cut periods using composite `[userId, date]` indexing.
- **Body Weight Progression**: Track current body weight against target goals with visual milestone indicators.

### 📊 Analytics, Charts & Reporting
- **Multi-Period Analytics**: View nutrition performance across 7 Days, 15 Days, or Custom Date Ranges.
- **Interactive Visualizations (Recharts)**:
  - Weekly/Daily Calorie Intake vs Target Bar & Line Charts.
  - Macro distribution trends across time.
  - Interactive Macronutrient Composition Donut Chart.
  - Micronutrient and performance breakdown tables.
- **Instant PDF Export**: Generate and download complete, high-definition nutrition reports as multi-page A4 PDFs with a single click.

### 🤖 Agentic AI Nutritionist (`ChatBotFAB`)
- **Interactive Conversational Interface**: Minimizable floating assistant with a full-screen expanded viewing mode and clean typography.
- **Server-Sent Events (SSE) Streaming**: Real-time token streaming powered by Google Gemini 3.8 Flash.
- **Autonomous Tool Execution**: The AI agent evaluates intent and executes backend tools on behalf of the user:
  - `logMeal`: Directly calculates macros and logs meals into the database without requiring confirmations.
  - `getMeals`: Queries the user's logged intake for today or historical dates.
  - `getGoals`: Retrieves active daily targets.
  - `getWeeklySummary`: Synthesizes multi-day trends.
- **Cross-Component Event Bus**: Emits custom `appDataChanged` browser events to refresh the dashboard and diary instantly whenever the AI performs an action.

### 📸 AI Food Vision Scanner
- **Multi-Format Upload**: Accepts food photos via file upload or camera capture.
- **Asynchronous Queue Ingestion**: Offloads image analysis to background workers, returning a job ID for client-side polling.
- **Automated Nutrition Extraction**: Estimates food identity, portion size, calories, protein, carbs, and fat.

### 📄 Bulk PDF Food Diary Import
- **Multi-Entry Document Parsing**: Extracts multiple meals from complex tabular or textual food diary PDFs.
- **Asynchronous Processing**: Background extraction using BullMQ prevents request timeouts and handles multi-page PDFs reliably.

---

## 🏗 System Architecture

CalorieMate adopts a decoupled client-server architecture paired with an asynchronous job-processing pipeline and a Redis caching layer.

```mermaid
flowchart TB
    %% Client Layer
    subgraph ClientLayer ["Client Layer (React 19 + Vite)"]
        SPA["React SPA (Tailwind CSS)"]
        ChatFAB["Agentic AI Assistant (SSE)"]
        PDFGen["html2canvas + jsPDF Engine"]
    end

    %% API Gateway Layer
    subgraph APILayer ["Backend API (Express 5.2 / Node.js)"]
        Router["Express REST Router"]
        AuthMid["Auth Middleware (JWT Verify)"]
        ZodVal["Zod Schema Validation"]
        
        subgraph Controllers ["Controllers"]
            AuthC["authController"]
            MealC["mealController"]
            GoalC["goalController"]
            ReportC["reportController"]
            AIC["aiController"]
            PDFC["pdfImportController"]
        end
    end

    %% Asynchronous Processing Layer
    subgraph QueueLayer ["Background Processing (BullMQ & Redis)"]
        RedisQ[("Redis Server (ioredis)")]
        FoodQ["Queue: 'food-analysis'"]
        DocQ["Queue: 'pdf-import'"]
        
        subgraph Workers ["BullMQ Workers (Monolith/Dedicated)"]
            FoodWorker["foodAnalysis.worker.js"]
            DocWorker["pdfImport.worker.js"]
        end
    end

    %% External & Persistence Layer
    subgraph PersistenceLayer ["Persistence & External Services"]
        PrismaORM["Prisma Client ORM"]
        Postgres[("PostgreSQL Database")]
        GeminiAPI[["Google Gemini 3.8 Flash API"]]
        CloudinaryCDN[["Cloudinary Media CDN"]]
    end

    %% Connections
    SPA -- "HTTP / REST (Axios Interceptors)" --> Router
    ChatFAB -- "Server-Sent Events (SSE)" --> AIC
    Router --> AuthMid --> ZodVal
    ZodVal --> Controllers
    
    %% Synchronous Paths
    AuthC & MealC & GoalC --> PrismaORM
    ReportC <--> |"Cache Read/Write (TTL 1h)"| RedisQ
    ReportC --> PrismaORM
    PrismaORM <--> Postgres
    
    %% Async Job Pipeline
    AIC -- "SHA-256 Hash & Enqueue" --> FoodQ
    PDFC -- "SHA-256 Hash & Enqueue" --> DocQ
    FoodQ & DocQ --> RedisQ
    RedisQ --> FoodWorker & DocWorker
    
    %% Workers to Services
    FoodWorker & DocWorker --> GeminiAPI
    FoodWorker & DocWorker --> PrismaORM
    MealC -- "Invalidate Cache (SCAN)" --> RedisQ
```

---

## 🔐 Security, Hashing & Authentication

CalorieMate implements defense-in-depth security principles across transport, authentication, input validation, and file integrity.

```mermaid
flowchart LR
    subgraph Client ["Client Request"]
        Password["Plaintext Password"]
        File["Uploaded File (Image/PDF)"]
    end

    subgraph Security ["Security Engine"]
        Bcrypt["bcryptjs (Salt Rounds: 10)"]
        SHA["Crypto SHA-256 Fingerprinting"]
        JWT["HMAC SHA-256 JWT Token"]
        Zod["Zod Validation Middleware"]
    end

    subgraph Storage ["Database State"]
        UserTable[("User.password (Hash)")]
        JobTable[("Job.fileHash (Unique Constraint)")]
    end

    Password --> Bcrypt --> UserTable
    File --> SHA --> JobTable
    UserTable -. "Verify & Sign" .-> JWT
```

### 1. Password Hashing (`bcryptjs`)
- **Adaptive Salt Generation**: Uses `bcrypt.genSalt(10)` to compute a unique 128-bit salt per user.
- **One-Way Cryptographic Storage**: Passwords are never stored or logged in plaintext. Hashes take the standard `$2a$10$...` Modular Crypt Format.
- **Timing Attack Mitigation**: Password validation uses `bcrypt.compare()`, which executes in constant time to eliminate timing vulnerability attacks.
- **Granular Auth Error Feedback**: Provides exact, secure error categorization for clients ("User does not exist" vs. "Incorrect password") while maintaining operational safety.

### 2. Stateless JWT Authentication
- **Token Format**: Standard JSON Web Tokens signed using HMAC SHA-256 (`HS256`).
- **Token Expiration**: Configured with a 30-day lifecycle (`expiresIn: '30d'`).
- **Authorization Guard**: The `protect` middleware verifies incoming `Authorization: Bearer <token>` headers, decodes the payload, and injects `req.user.id` into the request lifecycle.
- **Tenant Isolation**: Database queries strictly use `req.user.id` derived from the cryptographically verified JWT token—preventing Cross-Tenant Object Reference vulnerabilities.

### 3. File Cryptographic Hashing & Idempotency (SHA-256)
Uploading identical files can trigger redundant, costly AI operations. CalorieMate implements SHA-256 cryptographic idempotency:
```javascript
// Compute SHA-256 digest of uploaded file buffer
const fileBuffer = fs.readFileSync(filePath);
const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

// Check composite unique index [userId, fileHash]
const existingJob = await prisma.foodAnalysisJob.findUnique({
  where: { userId_fileHash: { userId, fileHash } }
});

if (existingJob && existingJob.status === 'COMPLETED') {
  // Return cached result immediately with zero redundant compute
  return res.status(200).json({ success: true, result: existingJob.result });
}
```
- **Composite Unique Indexing**: Both `FoodAnalysisJob` and `PdfImportJob` enforce `@@unique([userId, fileHash])`.
- **Deduplication Lifecycle**:
  - If a file is uploaded while a previous job is still `PENDING` or `PROCESSING`, the client receives the existing `jobId` to avoid duplicate jobs.
  - If the previous job is `COMPLETED`, the stored result is returned immediately (`200 OK`) in milliseconds.

### 4. Input Validation via Zod
All critical payloads are validated against strict Zod schemas before reaching business logic:
- `registerSchema`: Validates email formatting, non-empty names, and minimum password lengths.
- `loginSchema`: Ensures credentials conform to required constraints.
- `mealSchema`: Validates numeric ranges for calories and macros, as well as strict enum validation for meal types (`Breakfast | Lunch | Snacks | Dinner`).

---

## ⚙️ Asynchronous Task Processing & BullMQ

To ensure sub-100ms HTTP response times, expensive computational workloads (Gemini Vision analysis and PDF parsing) are delegated to BullMQ queues powered by Redis.

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant API as Express API
    participant DB as PostgreSQL
    participant Redis as Redis Queue (BullMQ)
    participant Worker as Background Worker
    participant Gemini as Google Gemini API

    User->>API: POST /api/ai/analyze-food (multipart/form-data)
    API->>API: Compute SHA-256 fileHash
    API->>DB: Check [userId, fileHash] exists?
    alt File Already Processed
        DB-->>API: Returns existing record (COMPLETED)
        API-->>User: 200 OK (Instant Cached Result)
    else New File Upload
        API->>Redis: Enqueue Job (Queue: 'food-analysis')
        API->>DB: Insert FoodAnalysisJob (status = 'PENDING')
        API-->>User: 202 Accepted { jobId: uuid, status: 'PENDING' }
        
        loop Polling every 2s
            User->>API: GET /api/ai/food-analysis/status/:jobId
            API->>DB: Query job status
            DB-->>API: Current status
            API-->>User: { status: 'PENDING' | 'PROCESSING' }
        end

        Redis->>Worker: Dispatch Job
        Worker->>DB: Update status to 'PROCESSING'
        Worker->>Gemini: gemini-3.8-flash Vision Inference
        Gemini-->>Worker: Structured Nutritional JSON
        Worker->>DB: Transaction: Save result & status = 'COMPLETED'
        
        User->>API: GET /api/ai/food-analysis/status/:jobId
        API->>DB: Query job status
        DB-->>API: Status 'COMPLETED' + result data
        API-->>User: 200 OK { status: 'COMPLETED', result: {...} }
    end
```

### BullMQ Configuration & Resilience
- **Exponential Backoff**: Configured with 3 retry attempts with exponential backoff delays.
- **Failover / Graceful Degradation**: If Redis is unreachable, the system fails cleanly with a `503 Service Unavailable` message without taking down the server.
- **Monolith Worker Deployment**: In development and single-container deployments, workers automatically initialize inside `server.js`. In production, workers can scale horizontally as standalone processes (`npm run worker`, `npm run worker:pdf`).

---

## 🚀 Redis Caching & Invalidation Strategy

Weekly and custom nutrition reports perform multi-table aggregations over dates and meals. CalorieMate incorporates a caching strategy with automatic invalidation.

```mermaid
flowchart TD
    Req["GET /api/reports/weekly"] --> CheckCache{"Redis Cache Hit?<br/>key: weekly_report:uid:start:end"}
    CheckCache -- Yes --> ReturnCache["Return Cached JSON (instant)"]
    CheckCache -- No --> QueryDB["Query PostgreSQL (Prisma)"]
    QueryDB --> StoreCache["Store in Redis (TTL: 1 Hour)"]
    StoreCache --> ReturnDB["Return Aggregated Data"]

    Mutation["Mutation: Add / Edit / Delete Meal or Goal"] --> Invalidate["invalidateWeeklyReportCache(userId)"]
    Invalidate --> Scan["SCAN pattern: weekly_report:userId:* (Non-blocking)"]
    Scan --> DeleteKeys["DEL Matching Keys"]
```

### Key Highlights
- **Scoped Cache Keys**: Keys follow `weekly_report:${userId}:${startDate}:${endDate}`, strictly isolating user caches.
- **Non-Blocking Invalidation (`SCAN`)**: Never uses `KEYS *`, which blocks Redis event loops. Instead, it iterates safely using `SCAN` with a count of 100 to clean up invalid keys without latency spikes.
- **Mutation Hooks**: Any meal creation, modification, deletion, or goal update automatically triggers cache invalidation for that user.

---

## 🧠 AI Integration & Agentic Architecture

CalorieMate integrates Google Gemini 3.8 Flash (`gemini-3.8-flash`) across two distinct modalities:

### 1. The Agentic Chatbot (`ChatBotFAB.jsx`)
The chatbot operates on an agentic loop over Server-Sent Events (SSE):

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as ChatBotFAB (Frontend)
    participant AI as aiController.chat (Backend)
    participant Gemini as Google Gemini 3.8 Flash
    participant DB as Prisma / PostgreSQL

    User->>UI: "I just had a bowl of oatmeal and 2 boiled eggs"
    UI->>AI: POST /api/ai/chat (SSE Connection)
    AI->>Gemini: Stream prompt with registered function tools
    Gemini-->>AI: Function Call: logMeal({ name, mealType: 'Breakfast', calories: 340, ... })
    AI->>DB: Execute mealService.addMeal()
    DB-->>AI: Meal successfully created
    AI-->>UI: SSE Event: action { type: 'meal_logged', meal: {...} }
    Note over UI: UI dispatches 'appDataChanged'<br/>Dashboard updates live!
    AI->>Gemini: Function result payload
    Gemini-->>AI: Stream conversational text tokens
    AI-->>UI: SSE Event: text chunks ("Logged your oatmeal & eggs (340 kcal)...")
    AI-->>UI: SSE Event: [DONE]
```

#### Registered Agent Tools:
1. `logMeal`: Directly records meal items with estimated calories, protein, carbs, and fat.
2. `getMeals`: Queries the user's logged meals for a given day.
3. `getGoals`: Retrieves nutritional goals to provide feedback on calorie headroom.
4. `getWeeklySummary`: Synthesizes 7-day intake averages.

### 2. Multi-Modal Vision & Document Extraction
- **Image Scanner**: Sends the image buffer directly to Gemini 3.8 Flash with specialized instructions to identify dishes and estimate macronutrient breakdowns.
- **PDF Diary Parser**: Ingests multi-page base64-encoded PDF documents directly into Gemini's multi-modal context, instructing the model to parse tabular and textual data into structured arrays of meals.

---

## 🖨 PDF Generation & Reporting Engine

Rather than relying on server-side headless browsers (e.g. Puppeteer) which consume heavy CPU/memory footprints, CalorieMate utilizes a client-side vector-accurate capture engine:

```mermaid
flowchart LR
    ReportDOM["DOM Element (#report-content)<br/>(Charts, Metrics, Donut)"] --> Canvas["html2canvas (2x Scale, CORS Enabled)"]
    Canvas --> RasterData["High-Res JPEG/PNG Data URL"]
    RasterData --> PDFDoc["jsPDF Document (A4 Orientation)"]
    PDFDoc --> Pagination["Multi-Page Slice & Auto-Pagination Loop"]
    Pagination --> Download["Browser Direct Download (.pdf)"]
```

- **High-DPI Capture**: Renders DOM elements at `scale: 2` for crisp graphics and typography on high-resolution displays.
- **Dynamic Auto-Pagination**: Calculates content height against standard A4 page heights, adding pages automatically when content overflows.
- **Dynamic File Naming**: Formats the downloaded file according to the selected date range (e.g., `Nutrition_Report_7_days.pdf`, `Nutrition_Report_custom.pdf`).

---

## 🗄 Database Schema & Relational Design

The relational model is managed with Prisma ORM and hosted on PostgreSQL.

```mermaid
erDiagram
    User ||--o{ Meal : logs
    User ||--o{ Goal : configures
    User ||--o{ FoodAnalysisJob : initiates
    User ||--o{ PdfImportJob : submits

    User {
        int id PK
        string name
        string email UK
        string password
        string avatarUrl
        int targetCalories
        datetime createdAt
        datetime updatedAt
    }

    Meal {
        int id PK
        string name
        string mealType
        float quantity
        string unit
        float calories
        float protein
        float carbs
        float fat
        string imageUrl
        datetime date
        int userId FK
        datetime createdAt
    }

    Goal {
        int id PK
        float targetWeight
        float currentWeight
        int targetCalories
        float targetProtein
        float targetCarbs
        float targetFat
        string date
        int userId FK
        datetime createdAt
        datetime updatedAt
    }

    FoodAnalysisJob {
        string id PK
        int userId FK
        string imageId UK
        string imagePath
        string fileHash
        string status
        json result
        string errorMsg
        datetime createdAt
        datetime updatedAt
    }

    PdfImportJob {
        string id PK
        int userId FK
        string imageId UK
        string pdfPath
        string fileHash
        string status
        json result
        string errorMsg
        datetime createdAt
        datetime updatedAt
    }
```

### Table Details & Indices
- **`User`**: Contains authentication credentials and profile preferences. Enforces a unique index on `email`.
- **`Meal`**: Stores individual meal entries. Linked by foreign key to `User(id)` with cascading relationship integrity.
- **`Goal`**: Stores nutritional targets. Features a unique compound index `@@unique([userId, date])`, allowing one global default goal (`date = null`) alongside date-specific overrides (`date = "YYYY-MM-DD"`).
- **`FoodAnalysisJob` & `PdfImportJob`**: State machines for tracking async tasks. Features a unique compound index `@@unique([userId, fileHash])` for SHA-256 deduplication and caching.

---

## 📡 API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |

### Meal Tracking Endpoints (`/api/meals`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/meals` | Get meals within date range and optional `mealType` filter | Yes (Bearer) |
| `POST` | `/api/meals` | Log a new meal (enforces "Today Only" rule) | Yes (Bearer) |
| `PUT` | `/api/meals/:id` | Update an existing meal | Yes (Bearer) |
| `DELETE` | `/api/meals/:id` | Delete a meal entry | Yes (Bearer) |

### Goals Endpoints (`/api/goals`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/goals` | Get default global goal | Yes (Bearer) |
| `POST` | `/api/goals` | Set or update default/date-specific goal | Yes (Bearer) |
| `GET` | `/api/goals/range` | Fetch goals across a specified date range | Yes (Bearer) |

### Reports & Analytics (`/api/reports`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/weekly` | Get 7-day aggregated report (Redis-cached) | Yes (Bearer) |

### AI & Async Queue Endpoints (`/api/ai` & `/api/diary`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Conversational assistant stream via Server-Sent Events | Yes (Bearer) |
| `POST` | `/api/ai/analyze-food` | Upload food image, returns BullMQ `jobId` | Yes (Bearer) |
| `GET` | `/api/ai/food-analysis/status/:jobId` | Poll food analysis job status | Yes (Bearer) |
| `POST` | `/api/diary/import-pdf` | Upload PDF diary, returns BullMQ `jobId` | Yes (Bearer) |
| `GET` | `/api/diary/import-pdf/status/:jobId` | Poll PDF import job status | Yes (Bearer) |

---

## 💻 Frontend Architecture

The frontend is built with React 19 and Vite, styled using Tailwind CSS, and structured for modular maintainability:

```
Frontend/src/
├── components/
│   ├── ai/
│   │   └── ChatBotFAB.jsx          # Floating Action Button, expandable chat, SSE parser
│   ├── dashboard/
│   │   ├── CalorieRing.jsx         # Circular progress visualization
│   │   ├── MacroCard.jsx           # Macronutrient breakdown cards
│   │   └── MealsList.jsx           # Daily meal listings
│   ├── diary/
│   │   ├── MealLoggerModal.jsx     # Meal creation/edit modal with unit selectors
│   │   └── PdfImportModal.jsx      # Async PDF upload and polling modal
│   ├── reports/
│   │   ├── DailyNutritionPerformance.jsx
│   │   ├── MacroCompositionDonut.jsx
│   │   ├── MacroTrendsChart.jsx
│   │   ├── MicronutrientSummary.jsx
│   │   ├── NutritionSummaryMetrics.jsx
│   │   └── WeeklyCalorieChart.jsx
│   └── ui/
│       ├── ErrorAlert.jsx          # Clean user-facing error banners
│       └── ErrorState.jsx          # Full-page error states
├── context/
│   └── AuthContext.jsx             # Authentication provider and state management
├── pages/
│   ├── DashboardPage.jsx           # Main user overview
│   ├── FoodDiaryPage.jsx           # Chronological diary view
│   ├── GoalsPage.jsx               # Target calories and weight tracking
│   ├── ReportsPage.jsx             # Analytics dashboard & PDF export
│   └── ScannerPage.jsx             # AI Food Vision scanner
└── services/
    └── api.js                      # Axios instance with auth token injection
```

---

## 🛠 Local Setup & Run Guide

Follow these clear, step-by-step instructions to set up, configure, and run **CalorieMate** on your local machine.

---

### 📋 Prerequisites

Ensure you have the following installed on your system:

| Prerequisite | Minimum Version | Purpose | Download / Source |
| :--- | :--- | :--- | :--- |
| **Node.js** | v18.0.0+ | JavaScript runtime for Backend & Frontend | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0.0+ | Package manager (bundled with Node.js) | — |
| **PostgreSQL** | v14.0+ | Relational database | [postgresql.org](https://www.postgresql.org/download/) or free cloud [Supabase](https://supabase.com/) / [Neon](https://neon.tech/) |
| **Redis Server** | v6.2+ | Queue broker for BullMQ & cache | [redis.io](https://redis.io/download/) or free cloud [Upstash](https://upstash.com/) |
| **Google Gemini API Key** | — | Multimodal AI vision, chat & PDF parsing | Free at [Google AI Studio](https://aistudio.google.com/) |

---

### 1️⃣ Step 1: Clone the Repository

Clone the project to your computer and navigate into the project directory:

```bash
git clone https://github.com/your-username/personal-calorie-tracker.git
cd personal-calorie-tracker
```

The repository structure contains:
- **`Backend/`**: Node.js & Express API, Prisma ORM, BullMQ background workers.
- **`Frontend/`**: React 19 Single Page App built with Vite and Tailwind CSS.

---

### 2️⃣ Step 2: Backend Setup & Configuration

#### A. Install Backend Dependencies
Open your terminal, navigate into the `Backend` directory, and install the dependencies:

```bash
cd Backend
npm install
```

#### B. Create the Backend `.env` File
In the `Backend` folder, create a new file named `.env`:

```bash
# On Linux / macOS:
touch .env

# On Windows (PowerShell):
New-Item .env -ItemType File
```

Paste the following configuration into `Backend/.env`:

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# Authentication Secret (any random secure string)
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini API Key (Required for AI Chatbot, Food Scanner & PDF Parser)
# Get a free key at: https://aistudio.google.com/
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# PostgreSQL Database Connection String (Prisma ORM)
# If using a local PostgreSQL database:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/caloriemate?schema=public"

# If using a cloud database (Supabase / Neon):
# DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Redis Connection URL (Required for BullMQ queue processing & caching)
# If using a local Redis server:
REDIS_URL="redis://127.0.0.1:6379"

# If using cloud Redis (Upstash):
# REDIS_URL="redis://default:[password]@[host]:[port]"

# Cloudinary Credentials (Optional - used for profile avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

> [!NOTE]
> Make sure your PostgreSQL server and Redis server are running before continuing. If your PostgreSQL password contains special characters (e.g. `@`, `:`, `/`), URL-encode them (for example, `@` becomes `%40`).

#### C. Initialize Database with Prisma
Run Prisma to create all required database tables and generate the Prisma Client:

```bash
# Push the schema and create tables in your database:
npx prisma db push

# Generate the type-safe Prisma client:
npx prisma generate
```

*(Optional)* To view and manage your database visually in your browser:
```bash
npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

---

### 3️⃣ Step 3: Frontend Setup & Configuration

#### A. Install Frontend Dependencies
Open a **second terminal window**, navigate to the `Frontend` directory, and install dependencies:

```bash
cd Frontend
npm install
```

#### B. Create the Frontend `.env` File
In the `Frontend` folder, create a file named `.env`:

```bash
# On Linux / macOS:
touch .env

# On Windows (PowerShell):
New-Item .env -ItemType File
```

Add the following variable to `Frontend/.env` so the frontend knows where the backend is running:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api
```

---

### 4️⃣ Step 4: Running the Application

You need both the Backend and Frontend running concurrently in separate terminal windows.

#### Terminal 1: Start the Backend Server
```bash
cd Backend
npm run dev
```

*Expected output in Terminal 1:*
```
[Server] Booting background workers for monolith deployment...
[BullMQ] Food analysis worker started
[BullMQ] PDF import worker started
Server is running on port 5000
[Redis] Cache client connected
```

#### Terminal 2: Start the Frontend Client
```bash
cd Frontend
npm run dev
```

*Expected output in Terminal 2:*
```
  VITE v8.3.0  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 5️⃣ Step 5: Verification & Testing Checklist

Open your browser at **`http://localhost:5173`** and verify the app:

1. **User Sign Up / Login**:
   - Go to `/signup`, register a new user with email and password.
   - You will be automatically redirected to the dashboard.
2. **Log Meals**:
   - Go to the **Food Diary** page (`/diary`).
   - Click **"Log Meal"**, enter a meal name, select meal type (e.g. Breakfast), quantity, and calories. Confirm it appears in your daily list.
3. **AI Nutritionist Assistant**:
   - Click the floating green robot button in the bottom-right corner.
   - Ask: *"What did I eat today?"* — the AI will stream a response with your logged food.
   - Tell the AI: *"Log 2 scrambled eggs for breakfast"* — the agent will autonomously add the meal to your diary.
4. **AI Food Vision Scanner**:
   - Go to **Scanner** (`/scanner`) and upload a photo of food.
   - The photo is queued via BullMQ and analyzed by Google Gemini to extract nutrition macros.
5. **Reports & PDF Export**:
   - Go to **Reports** (`/reports`) and click **"Export PDF Report"** to download a clean, multi-page vector PDF report of your nutrition.

---

### 6️⃣ Step 6: Production Build (Optional)

To test the optimized production build of the frontend:

```bash
cd Frontend
npm run build
npm run preview
```

---

## ❓ Troubleshooting & FAQ

#### 1. Why do I see `PrismaClientInitializationError: Can't reach database server`?
- Ensure your PostgreSQL service is running.
- Verify the connection parameters in `Backend/.env` (`DATABASE_URL`).
- Confirm the host, port (`5432`), database name, username, and password are correct.

#### 2. Why do I see `503 Service Unavailable` or `[Redis] Cache client error` on uploads?
- BullMQ and caching require an active Redis instance.
- Ensure your local Redis server or cloud Redis instance (e.g. Upstash) is running and reachable via the address in `REDIS_URL` (`redis://127.0.0.1:6379`).
- You can test your Redis connection in a terminal:
  ```bash
  redis-cli ping
  # Should output: PONG
  ```

#### 3. Why does the AI Chatbot return `API key not valid`?
- Check that you copied the correct Gemini API key from [Google AI Studio](https://aistudio.google.com/) into `Backend/.env` under `GEMINI_API_KEY`.
- Avoid surrounding quotes or spaces in `.env`.
- Restart the backend server (`npm run dev`) after modifying `.env`.

#### 4. Why do frontend requests fail with `Network Error`?
- Verify that the backend server is running on port 5000.
- Verify that `Frontend/.env` has `VITE_API_URL=http://localhost:5000/api`.
- Remember that Vite requires a server restart (`npm run dev`) after modifying `.env`.

#### 5. Why can't I edit a meal from yesterday?
- CalorieMate enforces a strict **"Today Only" Mutation Rule**. Historical entries are permanently locked to preserve data integrity. Only meals logged for today's date can be edited or deleted.

#### 6. How does file deduplication work?
- When uploading an image or PDF, the backend computes a cryptographic SHA-256 hash. If that exact file was previously processed for your account, CalorieMate instantly retrieves the existing result from PostgreSQL, avoiding duplicate Gemini API calls and latency.

---

<div align="center">

Made with ❤️ by the CalorieMate Team • *Precision Nutrition Engineering*

</div>
