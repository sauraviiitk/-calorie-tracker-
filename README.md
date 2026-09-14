# 🥗 CalorieMate — AI-Powered Nutritional Intelligence Platform

<div align="center">

![CalorieMate Banner](./assets/app_banner.jpg)

**Production-grade, AI-driven personal nutrition and calorie tracking platform featuring agentic conversational intelligence, multi-modal ingestion, asynchronous task orchestration, and client-side vector reporting.**

[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](#6-installation-guide)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#5-tech-stack)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](#5-tech-stack)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](#5-tech-stack)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white)](#5-tech-stack)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](#5-tech-stack)
[![Redis BullMQ](https://img.shields.io/badge/Redis-BullMQ-DC382D?logo=redis&logoColor=white)](#5-tech-stack)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](#5-tech-stack)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](#5-tech-stack)

</div>

---

## 📖 Table of Contents

1. [Overview](#1-overview)
2. [Video Demonstration](#2-video-demonstration)
3. [Glimpse of the App](#3-glimpse-of-the-app)
4. [Features](#4-features)
5. [Tech Stack](#5-tech-stack)
6. [Installation Guide](#6-installation-guide)
7. [Project Structure](#7-project-structure)
8. [User Guide](#8-user-guide)

---

## 1. Overview

**CalorieMate** eliminates the cognitive friction inherent in traditional manual calorie and macronutrient tracking. Traditional tracking applications force users through repetitive search forms, complex dropdowns, and manual weight inputs. 

CalorieMate reimagines dietary management by unifying modern full-stack web architecture with multi-modal generative AI. Users can log and monitor nutritional intake through **natural conversational dialogue**, **meal photographs**, **tabular PDF food diaries**, or **precise manual entry**.

### 🎯 Core Engineering Objectives
- **Zero-Friction Multi-Modal Ingestion**: Log meals via natural conversational speech/text, computer vision camera capture, or document ingestion.
- **Agentic Autonomy**: Real-time Server-Sent Events (SSE) AI assistant capable of autonomous tool execution (querying intake, calculating macros, logging meals, and evaluating calorie budgets).
- **High-Performance Asynchronous Offloading**: Offload compute-heavy multi-modal AI inferences and PDF parsers to Redis-backed BullMQ queues with cryptographic SHA-256 deduplication.
- **Enterprise-Grade Data Isolation & Integrity**: Tenant-isolated PostgreSQL relational storage governed by cryptographically verified JWT claims, featuring a strict "Today-Only" historical data mutation lock.
- **Client-Side Vector Reporting**: Dynamic, multi-page vector-accurate PDF generation executed entirely in the browser, eliminating server-side headless browser overhead.

### 🏗 High-Level System Architecture


<div align="center">

![CalorieMate High-Level System Architecture](./assets/architecture.png)

</div>

---

## 2. Video Demonstration

Experience CalorieMate in action—from conversational AI meal logging to instant photo vision analysis and vector PDF reporting:

[Watch Demo Video](https://drive.google.com/file/d/1VJ21FlwP-XRjEfy_Whe7630Fx6m_H4mM/view?usp=sharing)

---

## 3. Glimpse of the App

Here is a visual overview of CalorieMate's interface and core workflows:

<div align="center">

### 1. Interactive Dashboard & Calorie Progress Ring
*Visualizes real-time calorie budgets, macronutrient breakdown cards, and chronological meal timelines.*
![1. Interactive Dashboard](./assets/Dashboard.png)

---

### 2. Chronological Food Diary & Quick Meal Logger
*Organized meal tracking with flexible portion metrics, macro distribution, and historical data locks.*
![2. Chronological Food Diary](./assets/Food%20Diary.png)

---

### 3. Agentic AI Nutritionist (`ChatBotFAB`)
*Conversational assistant featuring real-time Server-Sent Events token streaming and autonomous backend tool execution.*
![3. Agentic AI Nutritionist](./assets/ChatBot.png)

---

### 4. AI-Powered Calorie Extraction
*Ability to upload a photo (product nutrition label or a plate of food) and automatically extract and pre-fill calorie and nutritional information using AI image analysis which i aolready build.*
![4. AI-Powered Calorie Extraction](./assets/AddPhoto.png)

---

### 5. Multi-Period Nutrition Analytics & Client-Side PDF Export
*Interactive Recharts analytics paired with a client-side vector PDF generation engine.*
![5. Analytics and PDF Export](./assets/Report.png)

</div>

---

## 4. Features

### 🥗 1. Chronological Nutrition & Meal Tracking
- **Chronological Flow**: Meals are structured in natural order: **Breakfast → Lunch → Snacks → Dinner**.
- **Granular Macro Precision**: Computes and stores Calories (kcal), Protein (g), Carbohydrates (g), and Fat (g) with decimal precision.
- **Flexible Measurement Units**: Supports standard measurements (grams, ml, slices, cups, bowls, servings, tablespoons, teaspoons).
- **"Today Only" Mutation Integrity Rule**: Historical entries from previous dates are strictly immutable, preventing retroactive tampering with historical logs.

### 🤖 2. Agentic Conversational AI Nutritionist (`ChatBotFAB`)
- **Server-Sent Events (SSE) Streaming**: Delivers fast token-by-token streaming responses powered by Google Gemini 3.8 Flash.
- **Autonomous Tool Calling**: Rather than just chatting, the AI evaluates user intent and autonomously invokes backend functions:
  - `logMeal`: Computes nutritional values and writes new meals into PostgreSQL.
  - `getMeals`: Queries today's or historical logs to answer intake queries.
  - `getGoals`: Evaluates remaining calorie/macro headroom against user targets.
  - `getWeeklySummary`: Synthesizes 7-day intake averages and identifies trends.
- **Cross-Component Event Bus**: Emits custom `appDataChanged` DOM events, causing the Dashboard and Diary to refresh immediately when the AI logs a meal.

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as ChatBotFAB (Client)
    participant AI as aiController (Backend)
    participant Gemini as Google Gemini 3.8 Flash
    participant DB as PostgreSQL (Prisma)

    User->>UI: "I just had a bowl of oatmeal and 2 boiled eggs"
    UI->>AI: POST /api/ai/chat (SSE Stream)
    AI->>Gemini: Stream prompt with registered tool schemas
    Gemini-->>AI: Function Call: logMeal({ name: "Oatmeal & Eggs", mealType: "Breakfast", calories: 340, ... })
    AI->>DB: Execute meal insertion (Prisma)
    DB-->>AI: Meal record created
    AI-->>UI: SSE Event: action { type: 'meal_logged', meal: {...} }
    Note over UI: Dispatches 'appDataChanged' event<br/>Dashboard updates live!
    AI->>Gemini: Tool response payload
    Gemini-->>AI: Stream conversational confirmation text
    AI-->>UI: SSE Event: text chunks ("Logged your breakfast (340 kcal)...")
    AI-->>UI: SSE Event: [DONE]
```

### 📸 3. Multi-Modal Vision Scanner & PDF Diary Importer
- **Asynchronous BullMQ Pipeline**: Heavy computer vision analysis and PDF document parsing are enqueued into Redis BullMQ queues, preventing HTTP request timeouts.
- **SHA-256 Cryptographic Idempotency**: Files are fingerprinted upon upload. If an identical image or PDF was already processed, the system returns the cached result instantly, preventing redundant Gemini API costs.

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant API as Express API
    participant DB as PostgreSQL
    participant Redis as Redis Queue (BullMQ)
    participant Worker as Background Worker
    participant Gemini as Google Gemini 3.8 Flash

    User->>API: POST /api/ai/analyze-food (multipart/form-data)
    API->>API: Compute SHA-256 fileHash
    API->>DB: Check if [userId, fileHash] exists
    alt File Already Processed
        DB-->>API: Returns existing record (COMPLETED)
        API-->>User: 200 OK (Instant Cached Result)
    else New File Upload
        API->>Redis: Enqueue Job (Queue: 'food-analysis')
        API->>DB: Insert FoodAnalysisJob (status = 'PENDING')
        API-->>User: 202 Accepted { jobId: uuid, status: 'PENDING' }
        
        loop Polling every 2s
            User->>API: GET /api/ai/food-analysis/status/:jobId
            API->>DB: Check status
            DB-->>API: Status ('PENDING' | 'PROCESSING')
            API-->>User: Status response
        end

        Redis->>Worker: Dispatch Job
        Worker->>DB: Update status to 'PROCESSING'
        Worker->>Gemini: Multimodal Vision Inference
        Gemini-->>Worker: Structured Nutritional JSON
        Worker->>DB: Save result & status = 'COMPLETED'
        
        User->>API: GET /api/ai/food-analysis/status/:jobId
        API->>DB: Query job status
        DB-->>API: Status 'COMPLETED' + parsed macros
        API-->>User: 200 OK { status: 'COMPLETED', result: {...} }
    end
```

### 📊 4. Multi-Tier Redis Caching & Client-Side PDF Generation
- **Today's Data Cache (`today_summary:${userId}:${date}`)**: Caches today's logged meals, macro totals, active goals, and remaining budget (`TTL: 30 Mins`).
- **Last 7 Days Data Cache (`weekly_report:${userId}:${start}:${end}`)**: Caches 7-day daily intake vs target breakdowns and weekly averages for the Dashboard Weekly Chart and AI Nutritionist (`TTL: 1 Hour`).
- **Analytical Data Cache (`analytics_report:${userId}:${start}:${end}:${mealType}`)**: Caches multi-period (7d, 15d, custom) reports filtered by meal type for the Reports page (`TTL: 1 Hour`).
- **Scan-Based Cache Invalidation**: Whenever a user creates, updates, or deletes a meal or goal, CalorieMate executes non-blocking `SCAN` iteration to invalidate all three cache patterns for that user simultaneously without pausing the Redis server.
- **Client-Side Vector PDF Engine**: Generates multi-page A4 PDFs in the browser using `html2canvas` and `jsPDF`, capturing Recharts visualizations with crisp vector resolution and auto-pagination.

```mermaid
flowchart TD
    Req["Incoming Request<br/>(/today, /weekly, /analytics)"] --> CheckCache{"Redis Cache Hit?<br/>today_summary | weekly_report | analytics_report"}
    CheckCache -- Yes --> ReturnCache["Return Cached JSON (Sub-10ms)"]
    CheckCache -- No --> QueryDB["Query PostgreSQL (Prisma Aggregation)"]
    QueryDB --> StoreCache["Store in Redis (TTL: 30m - 1h)"]
    StoreCache --> ReturnDB["Return Fresh Response"]

    Mutation["Mutation: Add / Edit / Delete Meal or Goal"] --> Invalidate["invalidateUserCaches(userId)"]
    Invalidate --> Scan["SCAN patterns: today_summary:* | weekly_report:* | analytics_report:*"]
    Scan --> DeleteKeys["DEL Matching Keys (Zero Stale Data)"]
```

---

## 5. Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `v19.2` | Core component architecture & declarative state |
| **Build Tool** | Vite | `v8.3` | High-performance Hot Module Replacement (HMR) & bundling |
| **Styling & Design** | Tailwind CSS | `v3.4` | Responsive utility-first design system |
| **Data Visualization** | Recharts | `v3.10` | Interactive calorie bar/line charts and macro donut charts |
| **PDF Reporting** | jsPDF & html2canvas | `v4.2` / `v1.4` | Client-side DOM rasterization and multi-page vector PDF export |
| **HTTP & Networking** | Axios | `v1.20` | REST client with automatic JWT bearer token interceptors |
| **Backend Runtime** | Node.js | `v18+` | Server execution runtime |
| **API Framework** | Express | `v5.2` | REST API routes, middleware pipeline, and SSE streaming |
| **ORM & Modeling** | Prisma | `v5.22` | Type-safe database client and automated schema migrations |
| **Primary Database** | PostgreSQL | `v14+` | Relational storage with composite indices and cascading constraints |
| **Message Broker** | Redis & BullMQ | `v7` / `v6.3` | Asynchronous worker queues and distributed caching |
| **AI Intelligence** | Google Gemini | `3.8 Flash` | Multimodal vision analysis, conversational SSE streaming, and agentic tool-calling |
| **Authentication** | bcryptjs & JWT | `v3.0` / `v9.0` | 10-round salted password hashing and stateless HS256 tokens |
| **Schema Validation** | Zod | `v4.6` | Runtime input validation for incoming request payloads |

### 🗄 Relational Database Schema

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

---

## 6. Installation Guide

Follow these step-by-step instructions to configure, run, and test **CalorieMate** on your local machine.

### 📋 Prerequisites

Ensure you have the following installed on your workstation:

1. **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
2. **npm**: v9.0.0 or higher (packaged with Node.js)
3. **PostgreSQL**: v14 or higher ([Download PostgreSQL](https://www.postgresql.org/download/) or use a free cloud database like [Supabase](https://supabase.com/) / [Neon](https://neon.tech/))
4. **Redis Server**: v6.2 or higher ([Download Redis](https://redis.io/download/) or use a free cloud instance from [Upstash](https://upstash.com/))
5. **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

---

### 1️⃣ Step 1: Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/personal-calorie-tracker.git
cd personal-calorie-tracker
```

---

### 2️⃣ Step 2: Backend Setup & Configuration

#### A. Install Backend Dependencies
```bash
cd Backend
npm install
```

#### B. Create the Backend `.env` File
In the `Backend` directory, create a new file named `.env`:

```bash
# Linux / macOS:
touch .env

# Windows (PowerShell):
New-Item .env -ItemType File
```

Populate `Backend/.env` with your configuration:

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# JWT Authentication Secret (any secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini API Key (Obtain free at https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# PostgreSQL Connection String (Prisma ORM)
# Local PostgreSQL default example:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/caloriemate?schema=public"
# Supabase / Cloud Postgres example:
# DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Redis Connection URL (Used for BullMQ queues and report caching)
# Local Redis default:
REDIS_URL="redis://127.0.0.1:6379"
# Cloud Redis (Upstash) example:
# REDIS_URL="redis://default:[password]@[host]:[port]"

# Cloudinary Credentials (Optional - used for profile avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

> [!NOTE]
> If your database password contains special characters (e.g. `@`, `:`, `/`), URL-encode them (for example, `@` becomes `%40`).

#### C. Push Database Schema with Prisma
Run Prisma to create all required database tables and generate the Prisma Client:

```bash
# Push schema and create tables in PostgreSQL:
npx prisma db push

# Generate the type-safe Prisma client:
npx prisma generate
```

*(Optional)* To inspect your database visually via Prisma Studio:
```bash
npx prisma studio
# Opens visual browser at http://localhost:5555
```

---

### 3️⃣ Step 3: Frontend Setup & Configuration

#### A. Install Frontend Dependencies
Open a **new terminal window**, navigate to `Frontend`, and install packages:

```bash
cd Frontend
npm install
```

#### B. Create the Frontend `.env` File
In the `Frontend` directory, create a `.env` file:

```bash
# Linux / macOS:
touch .env

# Windows (PowerShell):
New-Item .env -ItemType File
```

Configure `Frontend/.env` with the backend API address:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api
```

---

### 4️⃣ Step 4: Run the Application

Run both servers concurrently in separate terminals:

#### Terminal 1: Start the Backend Server
```bash
cd Backend
npm run dev
```

*Expected output:*
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

*Expected output:*
```
  VITE v8.3.0  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 5️⃣ Step 5: Production Build (Optional)

To compile and preview the production bundle:

```bash
cd Frontend
npm run build
npm run preview
```

---

## 7. Project Structure

CalorieMate is organized as a modular, decoupled monorepo:

```
personal-calorie-tracker/
├── Backend/
│   ├── prisma/
│   │   └── schema.prisma            # Prisma relational models and indexes
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js        # Multer Cloudinary storage engine
│   │   │   ├── gemini.js            # Google Gemini AI SDK client
│   │   │   └── redis.js             # ioredis cache client & BullMQ connection factory
│   │   ├── controllers/
│   │   │   ├── aiController.js      # Agentic chat SSE stream & vision job enqueuer
│   │   │   ├── authController.js    # Registration, login, profile management
│   │   │   ├── goalController.js    # Target calorie, macro, and weight endpoints
│   │   │   ├── mealController.js    # Meal logging, chronological filtering, cache hooks
│   │   │   ├── pdfImportController.js# PDF diary parsing and BullMQ job status
│   │   │   └── reportController.js  # Aggregated nutrition reports with Redis caching
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT Bearer token validation and user context injection
│   │   │   └── validateRequest.js   # Zod schema validation middleware
│   │   ├── routes/
│   │   │   ├── aiRoutes.js          # /api/ai/* endpoints
│   │   │   ├── authRoutes.js        # /api/auth/* endpoints
│   │   │   ├── goalRoutes.js        # /api/goals/* endpoints
│   │   │   ├── mealRoutes.js        # /api/meals/* endpoints
│   │   │   ├── pdfImportRoutes.js   # /api/diary/import-pdf/* endpoints
│   │   │   └── reportRoutes.js      # /api/reports/* endpoints
│   │   ├── utils/
│   │   │   ├── cacheInvalidator.js  # SCAN-based non-blocking Redis cache invalidation
│   │   │   ├── hash.js              # SHA-256 file fingerprinting
│   │   │   ├── token.js             # JWT signing and verification helpers
│   │   │   └── validationSchemas.js # Zod schemas for meals, goals, and auth
│   │   ├── workers/
│   │   │   ├── foodAnalysis.worker.js # BullMQ worker for Gemini Vision image inference
│   │   │   └── pdfImport.worker.js    # BullMQ worker for PDF document extraction
│   │   └── app.js                   # Express application configuration and middleware
│   ├── server.js                    # Server entrypoint and worker bootstrapper
│   ├── package.json                 # Backend dependencies and runner scripts
│   └── .env.example                 # Template for backend environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   └── ChatBotFAB.jsx   # Floating Action Button, expandable chat, SSE parser
│   │   │   ├── dashboard/
│   │   │   │   ├── CalorieRing.jsx  # Circular SVG calorie progress visualization
│   │   │   │   ├── MacroCard.jsx    # Macronutrient breakdown progress cards
│   │   │   │   └── MealsList.jsx    # Chronological meal listings
│   │   │   ├── diary/
│   │   │   │   ├── MealLoggerModal.jsx # Manual meal creation modal with unit selectors
│   │   │   │   └── PdfImportModal.jsx  # Asynchronous PDF upload and polling modal
│   │   │   ├── reports/
│   │   │   │   ├── DailyNutritionPerformance.jsx
│   │   │   │   ├── MacroCompositionDonut.jsx # Recharts macronutrient ratio donut
│   │   │   │   ├── MacroTrendsChart.jsx      # Recharts multi-day macro trend graph
│   │   │   │   ├── MicronutrientSummary.jsx
│   │   │   │   ├── NutritionSummaryMetrics.jsx
│   │   │   │   └── WeeklyCalorieChart.jsx    # Intake vs target bar chart
│   │   │   └── ui/
│   │   │       ├── ErrorAlert.jsx   # Contextual alert notifications
│   │   │       └── ErrorState.jsx   # Full-page fallback error views
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # User authentication state provider
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Daily overview and calorie status
│   │   │   ├── FoodDiaryPage.jsx    # Chronological diary view
│   │   │   ├── GoalsPage.jsx        # Target calories, macros, and weight progress
│   │   │   ├── ReportsPage.jsx      # Analytics dashboard and vector PDF exporter
│   │   │   └── ScannerPage.jsx      # AI Food Vision scanner interface
│   │   ├── services/
│   │   │   └── api.js               # Configured Axios instance with auth interceptors
│   │   ├── App.jsx                  # React Router root and route guards
│   │   ├── index.css                # Tailwind CSS imports and custom styling
│   │   └── main.jsx                 # React root DOM mount
│   ├── index.html                   # HTML5 document template
│   ├── package.json                 # Frontend dependencies and Vite scripts
│   ├── tailwind.config.js           # Tailwind design tokens and color theme
│   ├── vite.config.js               # Vite build configuration and plugins
│   └── .env.example                 # Template for frontend environment variables
│
└── README.md                        # Master project documentation
```

---

## 8. User Guide

Follow this guide to get the most out of CalorieMate:

### 👤 1. Account Creation & Profile Setup
1. Open **`http://localhost:5173`** in your browser.
2. Click **Sign Up** to create an account with your name, email, and password.
3. Upon registration, you are redirected to the **Dashboard**.
4. Navigate to **Goals** (`/goals`) to set your daily calorie baseline (e.g. 2,200 kcal), target macros (Protein, Carbs, Fat), and starting body weight.

### 📖 2. Logging Meals in the Food Diary
1. Navigate to **Food Diary** (`/diary`).
2. Click **"Log Meal"** to open the meal creator modal.
3. Select the meal slot (**Breakfast**, **Lunch**, **Snacks**, or **Dinner**).
4. Enter the food name, portion amount, unit (e.g., grams, slices, bowls), and calories/macros.
5. Save the entry to immediately see today's calorie budget update.

> [!TIP]
> **Today-Only Rule**: To maintain truthful dietary records, only meals logged for the current calendar date can be edited or deleted. Past records remain preserved as immutable historical data.

### 💬 3. Interacting with the AI Nutritionist
1. Click the floating green robot button (**`ChatBotFAB`**) located in the bottom-right corner of any page.
2. The assistant responds to natural language commands and executes tasks automatically:
   - *"What did I eat today?"* — summarizes your recorded meals and total consumed calories.
   - *"Log 2 scrambled eggs and a slice of whole wheat toast for breakfast"* — calculates estimated nutrition and directly records the meal into your database.
   - *"How much calorie headroom do I have left?"* — inspects your daily target against consumed calories and advises on remaining macros.
   - *"How was my nutrition this week?"* — summarizes multi-day averages and macro balance.
3. Watch the Dashboard update automatically in real-time without refreshing the page!

### 📷 4. Scanning Meals with AI Food Vision
1. Navigate to **Scanner** (`/scanner`).
2. Upload a photograph of a meal or take a photo using your device camera.
3. Click **"Analyze Food"**.
4. The image is uploaded, SHA-256 fingerprinted, and placed into the background queue.
5. The interface polls the status while Google Gemini estimates portion size, food identity, calories, protein, carbs, and fat.
6. Once complete, review the extracted values and click **"Save to Diary"**.

### 📄 5. Importing PDF Food Diaries
1. In the **Food Diary** page, click **"Import PDF"**.
2. Select a PDF document containing a food log or meal plan.
3. The BullMQ PDF worker parses the multi-page document, extracts structured meal entries, and populates them into your diary.

### 📈 6. Generating & Exporting PDF Reports
1. Navigate to **Reports** (`/reports`).
2. Select your desired timeframe: **Last 7 Days**, **Last 15 Days**, or **Custom Date Range**.
3. Explore the visual charts:
   - Daily Calorie Intake vs Target.
   - Macro distribution over time.
   - Macronutrient Composition Donut chart.
4. Click **"Export PDF Report"** in the top-right corner.
5. CalorieMate's client-side vector engine renders the charts and metrics into a formatted, multi-page A4 PDF file (`CalorieMate_Nutrition_Report.pdf`) that downloads directly to your device.

---

<div align="center">

Made with ❤️ by the CalorieMate Team • *Precision Nutrition Engineering*

</div>
