# AI-Powered KYC Fraud Detection

An end-to-end system for **automated identity verification and fraud detection** using OCR, AI/ML, and a web-based interface.  
The project simulates real-world KYC (Know Your Customer) workflows by processing Aadhaar cards, utility bills, and other identity documents, extracting relevant fields, cleaning data, and detecting potential fraud.

---

## 🚀 Features
- 📄 **Synthetic Document Generation** – Create sample Aadhaar and utility bills for training and testing.
- 🔍 **OCR & Data Extraction** – Extract text and fields from ID documents using Tesseract OCR.
- 🧹 **Data Cleaning & Preprocessing** – Standardize and validate extracted information.
- 🤖 **AI/ML Models** – Fraud detection pipeline for genuine vs. fraudulent documents.
- 🌐 **Full-Stack Web App** – Node.js backend with REST APIs and a React frontend for user interaction.
- 📊 **Structured Datasets** – Automatic conversion of OCR outputs into JSON/CSV for model training.

---

## 🛠️ Tech Stack
### Backend
- Node.js, Express.js
- Tesseract OCR (eng.traineddata included)
- Python utilities (for preprocessing, ML workflows)
- MongoDB / JSON storage for OCR results and user data

### Frontend
- React (Vite + Tailwind)
- shadcn/ui components
- Framer Motion animations

### General
- Docker (optional deployment)
- REST APIs for frontend-backend communication

---

## 📂 Repository Structure
```
ai-kyc-fraud-detection/
├── backend/              # Node.js + Express backend
│   ├── config/           # Config files (DB, env)
│   ├── controllers/      # Business logic
│   ├── middelware/       # Authentication / validation
│   ├── models/           # Data models
│   ├── routes/           # API endpoints
│   ├── uploads/          # Uploaded documents
│   ├── server.js         # Entry point
│   ├── requirements.txt  # Python OCR dependencies
│   └── package.json
│
├── frontend/             # React + Vite frontend
│   ├── public/           # Static assets
│   ├── src/              # UI components & pages
│   ├── demo/             # Demo assets
│   ├── vite.config.js
│   └── package.json
│
├── data/                 # Sample data and results
│   ├── raw_docs/         # Sample Aadhaar/utility docs
│   ├── processed/        # Cleaned and structured data
│   ├── ocr_raw.json      # Raw OCR output
│   └── ocr_results.json  # Cleaned OCR results
│
└── README.md             # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Bhavyasri212/ai-kyc-fraud-detection.git
cd ai-kyc-fraud-detection
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
pip install -r requirements.txt   # For OCR & ML utilities
```

Start the backend server:
```bash
node server.js
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The app will run on **http://localhost:5173** (frontend) and backend APIs on **http://localhost:5000**.

---

## 📖 Usage

1. Upload an Aadhaar/utility bill via the frontend UI.  
2. Backend processes the document:
   - OCR extraction (Tesseract)
   - Data parsing & cleaning
   - Fraud detection model prediction  
3. Results are displayed in the frontend dashboard with fraud risk indicators.  

---

## 📊 Results

- ✅ The system successfully distinguishes between genuine and fraudulent KYC documents.
- 📈 Fraud detection models evaluated using metrics such as accuracy, precision, recall, and F1-score.
- 🔎 Provides risk classification (e.g., Low Risk, Medium Risk, High Risk) for each document uploaded.
- 📂 End-to-end pipeline tested with synthetic Aadhaar and utility bill datasets.
- 🖥️ Frontend dashboard displays results with clear fraud indicators and visual feedback for users.


