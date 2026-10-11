"""
Smart Building Energy Management System - Dataset Generator
Generates realistic building energy telemetry data based on thermodynamic principles:
- Baseline load (servers, emergency lighting, standby sensors)
- HVAC load proportional to temperature difference from 22°C setpoint + humidity enthalpy
- Occupancy-driven plug loads and interior lighting
- Diurnal human activity profiles (office hours 8:00 - 19:00 vs night/weekend)
"""

import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_building_energy_data(num_days=180, output_file="data/building_energy_dataset.csv"):
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    np.random.seed(42)

    start_date = datetime(2025, 1, 1, 0, 0)
    total_hours = num_days * 24

    records = []

    for i in range(total_hours):
        current_time = start_date + timedelta(hours=i)
        hour = current_time.hour
        day_of_week = current_time.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0

        # Seasonal ambient temperature simulation (diurnal oscillation + random fluctuations)
        # Daily cycle: coolest at 05:00, hottest at 14:00
        diurnal_temp = np.sin((hour - 8) * np.pi / 12)
        base_temp = 28.0 + 8.0 * np.sin((i / (24 * 30)) * np.pi) # seasonal shift
        temperature = round(float(base_temp + 6.0 * diurnal_temp + np.random.normal(0, 1.8)), 1)
        temperature = max(15.0, min(45.0, temperature))

        # Humidity has inverse correlation with daily temperature curve
        diurnal_humidity = -np.sin((hour - 8) * np.pi / 12)
        humidity = round(float(60.0 + 18.0 * diurnal_humidity + np.random.normal(0, 4.0)), 1)
        humidity = max(25.0, min(95.0, humidity))

        # Occupancy model (commercial smart building with capacity ~ 250 occupants)
        if is_weekend:
            # Low skeleton staff on weekends
            if 9 <= hour <= 18:
                occupancy = int(np.random.poisson(15))
            else:
                occupancy = int(np.random.poisson(3))
        else:
            # Weekday typical office bell-curve occupancy
            if 8 <= hour <= 18:
                # Peak between 10:00 and 16:00
                peak_factor = np.exp(-((hour - 13) ** 2) / 10.0)
                mean_occ = 180 * peak_factor + 30
                occupancy = int(np.random.normal(mean_occ, 12))
            elif 18 < hour <= 21 or 6 <= hour < 8:
                occupancy = int(np.random.normal(25, 6))
            else:
                occupancy = int(np.random.normal(5, 2))

        occupancy = max(0, min(260, occupancy))

        # Physics-grounded Energy consumption components (in kWh)
        # 1. Base load: server rooms, UPS, emergency circuits (~25 kWh)
        base_load = 25.0 + np.random.normal(0, 1.0)

        # 2. HVAC load: proportional to cooling degree hours (comfort setpoint = 22 C)
        # Plus latent heat load from humidity
        delta_temp = max(0.0, temperature - 22.0)
        hvac_load = (delta_temp * 3.8) + (max(0.0, humidity - 50.0) * 0.45)
        # If building is occupied during daytime, HVAC runs at full capacity
        if 8 <= hour <= 19 and occupancy > 10:
            hvac_load *= 1.45
        else:
            hvac_load *= 0.45 # Eco setback mode at night

        # 3. Plug and device load (computers, monitors, pantry appliances): ~0.35 kWh per occupant
        plug_load = occupancy * 0.38

        # 4. Lighting load: higher when occupied, especially early morning/late evening
        if 8 <= hour <= 19:
            lighting_load = 18.0 * (occupancy / 200.0) + 4.0
        elif 19 < hour <= 23 or 5 <= hour < 8:
            lighting_load = 8.0 * (occupancy / 50.0) + 2.0
        else:
            lighting_load = 2.5 # security perimeter night lighting

        # Total energy usage with noise
        total_energy = base_load + hvac_load + plug_load + lighting_load + np.random.normal(0, 3.5)
        total_energy = round(max(15.0, total_energy), 2)

        records.append({
            "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "temperature": temperature,
            "humidity": humidity,
            "occupancy": occupancy,
            "hour": hour,
            "energy_usage": total_energy
        })

    df = pd.DataFrame(records)
    df.to_csv(output_file, index=False)
    print(f"Generated {len(df)} records saved to {output_file}")
    print(df.describe())
    return df

if __name__ == "__main__":
    generate_building_energy_data(num_days=180, output_file="data/building_energy_dataset.csv")
