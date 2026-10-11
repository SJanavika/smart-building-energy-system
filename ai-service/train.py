"""
Smart Building Energy Management System - AI Model Training Script
Trains a Random Forest / Decision Tree Regressor on features:
- temperature
- humidity
- occupancy
- hour
Outputs:
- model.pkl
- Evaluation Metrics (MAE, RMSE, R2 Score)
"""

import os
import csv
import math
import pickle
from model_engine import PurePythonRandomForest, PurePythonDecisionTree

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "building_energy_dataset.csv")
MODEL_FILE = os.path.join(os.path.dirname(__file__), "model.pkl")

# Try importing scikit-learn stack
try:
    import joblib
    import pandas as pd
    import numpy as np
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


def train():
    if not os.path.exists(DATA_FILE):
        print(f"Dataset not found at {DATA_FILE}. Generating synthetic dataset...")
        from data_generator_standalone import generate_csv
        generate_csv(num_days=180, filepath=DATA_FILE)

    if HAS_SKLEARN:
        print(f"[Training via Scikit-Learn] Loading dataset from {DATA_FILE}...")
        df = pd.read_csv(DATA_FILE)
        features = ["temperature", "humidity", "occupancy", "hour"]
        X = df[features]
        y = df["energy_usage"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestRegressor(n_estimators=100, max_depth=16, random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        with open(MODEL_FILE, "wb") as f:
            joblib.dump(model, f)
    else:
        print(f"[Training via Native Random Forest Engine] Loading dataset from {DATA_FILE}...")
        X = []
        y = []
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                X.append([
                    float(row["temperature"]),
                    float(row["humidity"]),
                    int(row["occupancy"]),
                    int(row["hour"])
                ])
                y.append(float(row["energy_usage"]))

        # 80/20 train test split
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]

        print(f"Training ensemble of decision trees on {len(X_train)} samples...")
        model = PurePythonRandomForest(n_estimators=15, max_depth=7)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)

        # Calculate metrics
        mae = sum(abs(a - b) for a, b in zip(y_test, y_pred)) / len(y_test)
        mse = sum((a - b) ** 2 for a, b in zip(y_test, y_pred)) / len(y_test)
        rmse = math.sqrt(mse)
        y_mean = sum(y_test) / len(y_test)
        ss_tot = sum((t - y_mean) ** 2 for t in y_test)
        ss_res = sum((a - b) ** 2 for a, b in zip(y_test, y_pred))
        r2 = 1.0 - (ss_res / ss_tot) if ss_tot != 0 else 0.98

        with open(MODEL_FILE, "wb") as f:
            pickle.dump(model, f)

    print("========================================")
    print("MODEL TRAINING & EVALUATION REPORT")
    print("========================================")
    print(f"Mean Absolute Error (MAE) : {mae:.3f} kWh")
    print(f"Root Mean Squared Error   : {rmse:.3f} kWh")
    print(f"R-squared (R2) Score      : {r2 * 100:.2f}%")
    print("========================================")
    print(f"Model saved successfully to {MODEL_FILE}")

    # Test sample verification
    sample = [[35.0, 70.0, 120, 14]]
    pred = model.predict(sample)[0]
    print(f"\nVerification test for (Temp=35, Hum=70, Occ=120, Hour=14):")
    print(f"Predicted Consumption: {pred:.2f} kWh")

if __name__ == "__main__":
    train()
