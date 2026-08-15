# Procecev-Ai: Real-Time Multilingual Speech-to-Text & Hinglish AI

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Browser%20Native-blueviolet.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Database](https://img.shields.io/badge/Database-H2%20%7C%20MySQL-yellow.svg)](https://www.h2database.com)

**Procecev-Ai** is an advanced full-stack web application designed for real-time speech-to-text live transcription with specialized support for **Hindi + English (Bilingual / Hinglish)** code-switching, Text-to-Speech (TTS) synthesis, and full transcription history management with CRUD operations.

---

## 🌟 Key Features

- 🎙️ **Real-Time Live Speech-to-Text**: Low-latency, streaming live transcription powered by the browser Web Speech API (no third-party paid API keys required).
- ⚡ **Intelligent Hinglish / Bilingual Normalizer**:
  - Automatically identifies and formats mixed Hindi + English speech in real time.
  - When a user speaks:
    > *"हेलो क्या मेरी आवाज आ रही है are you able to listen me"*
  - The engine keeps authentic Hindi words in Devanagari script (`हेलो क्या मेरी आवाज आ रही है`) and formats English words in Latin script (`are you able to listen me` / `are u abble to listen me`).
  - Seamlessly converts phonetic Devanagari English words (*"आर यू एबल टू लिसन मी"*, *"कैन यू हियर मी"*, *"एम आई ऑडिबल"*, *"थैंक यू"*, *"प्लीज"*, *"स्क्रीन शेयर"*) into clean English text.
- 💾 **Instant Save & History Dashboard**:
  - Save live transcriptions with one click.
  - Filter, search, edit, listen to, and delete saved transcripts.
- 🔊 **Multilingual Text-to-Speech (TTS)**:
  - Read aloud pure or mixed Hindi and English text with adjustable speed and customizable voices.
- 🗄️ **Dual Database Architecture**:
  - **H2 (Default/Dev)**: Zero-setup in-memory database with interactive web console.
  - **MySQL (Production)**: Persistent database profile with automated schema migration.
- 🌐 **Robust RESTful API with Universal CORS**:
  - Spring Boot 3 backend providing standard endpoints and automatic fallback handling for frontend development ports (`5173`, `5174`, etc.).

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Modular UI with vanilla modern CSS design tokens |
| **Backend** | Spring Boot 3.2.5 | Java 21, Spring Web, Spring Data JPA, Jakarta Validation |
| **Speech-to-Text** | Web Speech API | Client-side real-time continuous speech recognition |
| **Text-to-Speech** | Web Speech Synthesis | Native browser synthesis supporting regional voices |
| **Speech Processing**| Custom Bilingual Engine | Real-time script normalization & phonetic transliteration (`hinglishProcessor.js`) |
| **Database** | H2 & MySQL | Default in-memory H2 database; switchable to MySQL |
| **Build Tooling** | Gradle 8.7 & npm | Gradle Wrapper included for backend; Vite for frontend |

---

## 📁 Repository Structure

```
Procecev-Ai/
├── backend/
│   ├── build.gradle                              # Spring Boot build configuration
│   ├── run.bat                                   # Backend startup script with JDK 21
│   ├── gradlew / gradlew.bat                     # Gradle wrapper
│   └── src/
│       └── main/
│           ├── java/com/speechtotext/
│           │   ├── SpeechToTextApplication.java  # Main application entry point
│           │   ├── config/
│           │   │   └── CorsConfig.java           # Universal CORS configuration
│           │   ├── controller/
│           │   │   └── TranscriptionController.java # REST API endpoints
│           │   ├── dto/
│           │   │   └── TranscriptionRequest.java # Validation request DTO
│           │   ├── model/
│           │   │   └── Transcription.java        # JPA database entity
│           │   ├── repository/
│           │   │   └── TranscriptionRepository.java
│           │   └── service/
│           │       └── TranscriptionService.java
│           └── resources/
│               └── application.yml               # H2 and MySQL database profiles
├── frontend/
│   ├── package.json                              # Dependencies & scripts
│   ├── vite.config.js                            # Dev server & proxy settings
│   └── src/
│       ├── App.jsx                               # Main application tabs layout
│       ├── index.css                             # Modern responsive stylesheet
│       ├── api/
│       │   └── transcriptionApi.js               # API service with automatic fallback
│       ├── components/
│       │   ├── SpeechRecorder.jsx                # Live recording & bilingual recognition
│       │   ├── TextToSpeech.jsx                  # TTS voice synthesis
│       │   └── TranscriptionDashboard.jsx        # History table & CRUD actions
│       └── utils/
│           └── hinglishProcessor.js              # Real-time Hindi + English phonetic processor
├── start-app.bat                                 # One-click startup script (Backend + Frontend)
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **JDK 21** installed (e.g., `C:\Program Files\Java\jdk-21.0.10` or Temurin 21).
- **Node.js** (v18 or higher) & **npm**.
- **Google Chrome** or **Microsoft Edge** (for full Web Speech API recognition).

---

### Option A: One-Click Startup (Windows)

Simply double-click or run [`start-app.bat`](file:///c:/Users/shiva%20kumar/Downloads/test/start-app.bat) from the root directory:

```cmd
start-app.bat
```

This launches:
1. **Spring Boot Backend** on `http://localhost:8080`
2. **React Frontend** on `http://localhost:5173` (or `http://localhost:5174`)

---

### Option B: Manual Startup

#### 1. Start the Backend:
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
.\gradlew.bat bootRun
```
*Backend runs on:* **`http://localhost:8080`**

#### 2. Start the Frontend:
Open a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs on:* **`http://localhost:5173`** (or next available port)

---

## 🗄️ Database Management & Table Inspection

### 1. In-Memory H2 Database (Default)
When running in default dev mode, you can inspect the database tables directly in your browser:

1. Navigate to: **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)**
2. Enter connection details:
   - **Driver Class**: `org.h2.Driver`
   - **JDBC URL**: `jdbc:h2:mem:speechdb`
   - **User Name**: `sa`
   - **Password**: *(leave empty)*
3. Click **Connect**.
4. Run SQL queries:
   ```sql
   SELECT * FROM transcriptions ORDER BY created_at DESC;
   ```

### 2. MySQL Database (Persistent Mode)
1. Ensure MySQL is running on port `3306` and create the schema:
   ```sql
   CREATE DATABASE IF NOT EXISTS speech_to_text;
   ```
2. Start backend with the `mysql` active profile:
   ```powershell
   cd backend
   .\gradlew.bat bootRun --args='--spring.profiles.active=mysql'
   ```

---

## 📡 REST API Documentation

### Base URL: `http://localhost:8080/api/transcriptions`

| HTTP Method | Endpoint | Description | Sample Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/transcriptions` | Retrieve all saved transcriptions | `200 OK` |
| **GET** | `/api/transcriptions/{id}` | Retrieve a specific transcription by ID | `200 OK` |
| **POST** | `/api/transcriptions` | Save a new speech transcription | `201 Created` |
| **PUT** | `/api/transcriptions/{id}` | Update an existing transcription | `200 OK` |
| **DELETE** | `/api/transcriptions/{id}` | Delete a transcription by ID | `200 OK` |
| **GET** | `/api/transcriptions/health` | Service health check | `200 OK` |

### Sample JSON Request Body (`POST /api/transcriptions`):
```json
{
  "text": "हेलो क्या मेरी आवाज आ रही है are you able to listen me",
  "language": "Hindi + English",
  "confidenceScore": 0.95
}
```

### Sample JSON Response:
```json
{
  "id": 1,
  "text": "हेलो क्या मेरी आवाज आ रही है are you able to listen me",
  "language": "Hindi + English",
  "confidenceScore": 0.95,
  "createdAt": "2026-08-15T09:22:51.350232",
  "updatedAt": "2026-08-15T09:22:51.350232"
}
```

---

## 🌐 How the Bilingual / Hinglish Engine Works

In standard browser speech recognition, speaking English words during Hindi recognition (`hi-IN`) can transcribe English phrases into Devanagari phonetics (for example, *"आर यू एबल टू लिसन मी"* instead of *"are you able to listen me"*).

`hinglishProcessor.js` solves this with a real-time streaming pipeline:
1. **Multi-word Phrase Regex Matching**: Detects conversational and technical English expressions (*"आर यू able टू listen"*, *"कैन यू confirm"*, *"एम आई ऑडिबल"*, *"शेयर योर स्क्रीन"*).
2. **Protected Hindi Vocabulary Guard**: Safeguards authentic Hindi words (*"क्या"*, *"मेरी"*, *"आवाज"*, *"आ"*, *"रही"*, *"है"*, *"मुझे"*, *"आप"*) from accidental transliteration.
3. **Punctuation & Inter-Script Formatting**: Automatically standardizes spacing and typography between Devanagari and Latin script boundaries.

---

## 🛠️ Production Build

To build optimized production artifacts:

```powershell
# Build Backend Executable JAR
cd backend
.\gradlew.bat build -x test
# Output: backend/build/libs/speech-to-text-backend-1.0.0.jar

# Build Frontend Bundle
cd frontend
npm run build
# Output: frontend/dist/
```

---

## 🛡️ Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **403 / CORS Error** | Origin mismatch (e.g. running frontend on port 5174) | Backend is configured with universal CORS `allowedOriginPatterns("*")`. Ensure backend is restarted. |
| **Microphone blocked** | Browser permission denied | Click the camera/mic icon in the browser address bar and select **Allow**. |
| **`JAVA_HOME` error** | Java 8 or invalid JDK directory | Verify JDK 21 is set in your environment: `set JAVA_HOME=C:\Program Files\Java\jdk-21.0.10`. |
| **H2 database empty after restart** | In-memory DB resets upon app restart | Use MySQL profile for persistent storage across server restarts. |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE)....