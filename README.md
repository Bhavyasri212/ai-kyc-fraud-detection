# AI-Powered Identity Verification and Fraud Detection (KYC Compliance)

## Overview

This project develops an **AI-powered pipeline** for identity verification and fraud detection using **Aadhaar** and **utility bill documents**.

The system simulates **real-world KYC workflows** by:

- Generating **synthetic documents**
- Extracting text using **OCR**
- Parsing and cleaning extracted fields
- Preparing a **structured dataset** for model training

---

## Milestone 1 (Weeks 1–2)

**Focus:** Synthetic data generation, OCR extraction, field cleaning, and dataset preparation.

### Deliverables

- [x] **Synthetic Aadhaar & Utility Bill document generator** (`project root/generate_synthetic.py`)
- [x] **OCR extraction** (`ocr/ocr_extractor.py`)
- [x] **Field extraction from OCR raw text** (`ocr/field_extractor.py`)
- [x] **Cleaned & structured dataset** (`utils/cleaning_utils.py`)
- [x] **Final dataset in `.csv` and `.json` formats** (`data/processed/final_dataset.csv`, `data/processed/final_dataset.json`)
