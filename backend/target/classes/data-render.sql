INSERT INTO energy_data (device_name, floor_number, consumption, operating_hours, date)
SELECT sample.device_name, sample.floor_number, sample.consumption, sample.operating_hours, CURRENT_DATE
FROM (VALUES
    ('HVAC Central Chiller 1', 0, 480.5, 14.0),
    ('Floor 1 AHU Unit', 1, 152.4, 12.5),
    ('Floor 2 AHU Unit', 2, 174.8, 14.0),
    ('Floor 1 LED Grid', 1, 64.1, 12.5),
    ('Datacenter Server Racks', 3, 314.1, 24.0),
    ('Passenger Elevators Bank A', 0, 129.4, 16.5),
    ('Basement Water Pumps', 0, 56.0, 8.5)
) AS sample(device_name, floor_number, consumption, operating_hours)
WHERE NOT EXISTS (SELECT 1 FROM energy_data);

INSERT INTO reports (report_name, report_type, generated_date, file_path, total_consumption, total_cost)
SELECT 'Initial Building Efficiency Summary', 'MONTHLY', CURRENT_TIMESTAMP,
       '/reports/initial_summary.pdf', 1371.3, 10970.4
WHERE NOT EXISTS (SELECT 1 FROM reports);
