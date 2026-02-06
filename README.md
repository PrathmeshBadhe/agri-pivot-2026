# Agri-Pivot AI MVP

Industry-Grade Predictive Agriculture App using FastAPI, Prophet, and React.

## Project Structure

- `backend/`: FastAPI application, Database, and Prediction Logic.
- `frontend/`: React + Vite application with Recharts visualization.

## Setup Instructions

### 1. Backend

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Data Setup**:
    - Place your `onion_master_data.csv` in the `backend/` directory.
    - If you don't have it, a `sample_onion_data.csv` is provided for testing.
4.  Seed the Database:
    ```bash
    python seed_database.py
    ```
5.  Run the API Server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend

1.  Navigate to the frontend folder (open a new terminal):
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the Development Server:
    ```bash
    npm run dev
    ```
    Open your browser to the URL shown (usually `http://localhost:5173`).

## Features

- **High-Accuracy Prediction**: Uses Facebook Prophet with seasonality and holiday adjustments.
- **Database Integrated**: SQLite database for efficient data querying.
- **Interactive Charts**: Visual confidence intervals and future trends.
