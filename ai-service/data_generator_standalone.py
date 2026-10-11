"""
Smart Building Energy Management System - Standalone Dataset Generator
Uses ONLY Python Standard Library (math, random, csv, datetime) to generate
high-fidelity hourly thermodynamic building telemetry data without dependencies.
"""

import os
import csv
import math
import random
from datetime import datetime, timedelta

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "data", "building_energy_dataset.csv")

def generate_csv(num_days=180, filepath=OUTPUT_FILE):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    random.seed(42)

    start_date = datetime(2025, 1, 1, 0, 0)
    total_hours = num_days * 24

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "temperature", "humidity", "occupancy", "hour", "energy_usage"])

        for i in range(total_hours):
            current_time = start_date + timedelta(hours=i)
            hour = current_time.hour
            day_of_week = current_time.weekday()
            is_weekend = 1 if day_of_week >= 5 else 0

            # Diurnal temperature cycle
            diurnal_temp = math.sin((hour - 8) * math.pi / 12)
            seasonal_temp = 28.0 + 7.0 * math.sin((i / (24 * 30)) * math.pi)
            temperature = round(seasonal_temp + 6.0 * diurnal_temp + random.gauss(0, 1.5), 1)
            temperature = max(15.0, min(44.0, temperature))

            # Humidity cycle
            diurnal_humidity = -math.sin((hour - 8) * math.pi / 12)
            humidity = round(60.0 + 16.0 * diurnal_humidity + random.gauss(0, 3.5), 1)
            humidity = max(25.0, min(95.0, humidity))

            # Occupancy model
            if is_weekend:
                occupancy = random.randint(2, 18) if 9 <= hour <= 18 else random.randint(0, 5)
            else:
                if 8 <= hour <= 18:
                    peak_factor = math.exp(-((hour - 13) ** 2) / 10.0)
                    mean_occ = 175 * peak_factor + 30
                    occupancy = int(random.gauss(mean_occ, 10))
                elif (18 < hour <= 21) or (6 <= hour < 8):
                    occupancy = int(random.gauss(25, 5))
                else:
                    occupancy = int(random.gauss(5, 2))

            occupancy = max(0, min(260, occupancy))

            # Physical energy calculation components (kWh)
            base_load = 25.0 + random.gauss(0, 0.8)
            delta_temp = max(0.0, temperature - 22.0)
            hvac_load = (delta_temp * 4.0) + (max(0.0, humidity - 50.0) * 0.4)

            if 8 <= hour <= 19 and occupancy > 10:
                hvac_load *= 1.45
            else:
                hvac_load *= 0.45

            plug_load = occupancy * 0.38
            if 8 <= hour <= 19:
                lighting_load = 18.0 * (occupancy / 200.0) + 4.0
            elif 19 < hour <= 23 or 5 <= hour < 8:
                lighting_load = 8.0 * (occupancy / 50.0) + 2.0
            else:
                lighting_load = 2.5

            total_energy = round(max(15.0, base_load + hvac_load + plug_load + lighting_load + random.gauss(0, 2.5)), 2)

            writer.writerow([
                current_time.strftime("%Y-%m-%d %H:%M:%S"),
                temperature,
                humidity,
                occupancy,
                hour,
                total_energy
            ])

    print(f"Generated {total_hours} telemetry rows in {filepath}")

if __name__ == "__main__":
    generate_csv()
