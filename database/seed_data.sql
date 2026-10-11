-- ==============================================================================
-- Smart Building Energy Management System - Seed Data
-- ==============================================================================
USE smart_energy_db;

-- ------------------------------------------------------------------------------
-- 1. Default Users
-- Passwords are encrypted with BCrypt -> "Password@123"
-- ------------------------------------------------------------------------------
INSERT INTO users (name, email, password, role, created_at) VALUES
('System Administrator', 'admin@smartbuilding.io', '$2a$10$mtKpUqEP7uPqjYBUX8AFm.nqtnNVyR2rYqXi585wycZrI5pjxLOla', 'ROLE_ADMIN', NOW()),
('Facility Manager', 'manager@smartbuilding.io', '$2a$10$mtKpUqEP7uPqjYBUX8AFm.nqtnNVyR2rYqXi585wycZrI5pjxLOla', 'ROLE_USER', NOW()),
('Energy Auditor', 'auditor@smartbuilding.io', '$2a$10$mtKpUqEP7uPqjYBUX8AFm.nqtnNVyR2rYqXi585wycZrI5pjxLOla', 'ROLE_USER', NOW());

-- ------------------------------------------------------------------------------
-- 2. Energy Consumption Telemetry Records
-- ------------------------------------------------------------------------------
INSERT INTO energy_data (device_name, floor_number, consumption, operating_hours, date, created_at) VALUES
-- HVAC Central Systems
('HVAC Central Chiller 1', 0, 480.50, 14.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('HVAC Central Chiller 1', 0, 510.20, 15.5, CURDATE() - INTERVAL 5 DAY, NOW()),
('HVAC Central Chiller 1', 0, 495.80, 14.5, CURDATE() - INTERVAL 4 DAY, NOW()),
('HVAC Central Chiller 1', 0, 530.10, 16.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('HVAC Central Chiller 1', 0, 520.40, 15.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('HVAC Central Chiller 1', 0, 475.00, 13.5, CURDATE() - INTERVAL 1 DAY, NOW()),
('HVAC Central Chiller 1', 0, 515.60, 15.0, CURDATE(), NOW()),

-- AHU Floors 1 to 4
('Floor 1 AHU Unit', 1, 142.50, 12.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Floor 1 AHU Unit', 1, 155.20, 13.0, CURDATE() - INTERVAL 5 DAY, NOW()),
('Floor 1 AHU Unit', 1, 148.00, 12.5, CURDATE() - INTERVAL 4 DAY, NOW()),
('Floor 1 AHU Unit', 1, 160.70, 13.5, CURDATE() - INTERVAL 3 DAY, NOW()),
('Floor 1 AHU Unit', 1, 150.30, 12.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('Floor 1 AHU Unit', 1, 138.90, 11.5, CURDATE() - INTERVAL 1 DAY, NOW()),
('Floor 1 AHU Unit', 1, 152.40, 12.5, CURDATE(), NOW()),

('Floor 2 AHU Unit', 2, 165.00, 14.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Floor 2 AHU Unit', 2, 172.50, 14.5, CURDATE() - INTERVAL 5 DAY, NOW()),
('Floor 2 AHU Unit', 2, 168.40, 14.0, CURDATE() - INTERVAL 4 DAY, NOW()),
('Floor 2 AHU Unit', 2, 180.20, 15.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('Floor 2 AHU Unit', 2, 175.60, 14.5, CURDATE() - INTERVAL 2 DAY, NOW()),
('Floor 2 AHU Unit', 2, 162.00, 13.5, CURDATE() - INTERVAL 1 DAY, NOW()),
('Floor 2 AHU Unit', 2, 174.80, 14.0, CURDATE(), NOW()),

-- Smart Lighting Networks
('Floor 1 LED Grid', 1, 62.40, 12.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Floor 1 LED Grid', 1, 65.00, 12.5, CURDATE() - INTERVAL 5 DAY, NOW()),
('Floor 1 LED Grid', 1, 61.80, 12.0, CURDATE() - INTERVAL 4 DAY, NOW()),
('Floor 1 LED Grid', 1, 66.20, 13.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('Floor 1 LED Grid', 1, 63.50, 12.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('Floor 1 LED Grid', 1, 58.00, 11.0, CURDATE() - INTERVAL 1 DAY, NOW()),
('Floor 1 LED Grid', 1, 64.10, 12.5, CURDATE(), NOW()),

('Floor 2 LED Grid', 2, 70.20, 13.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Floor 2 LED Grid', 2, 73.00, 13.5, CURDATE() - INTERVAL 5 DAY, NOW()),
('Floor 2 LED Grid', 2, 69.50, 13.0, CURDATE() - INTERVAL 4 DAY, NOW()),
('Floor 2 LED Grid', 2, 74.80, 14.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('Floor 2 LED Grid', 2, 71.00, 13.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('Floor 2 LED Grid', 2, 65.40, 12.0, CURDATE() - INTERVAL 1 DAY, NOW()),
('Floor 2 LED Grid', 2, 72.30, 13.5, CURDATE(), NOW()),

-- Mission Critical IT Datacenter Load (24/7 Floor 3)
('Datacenter Server Racks', 3, 310.00, 24.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Datacenter Server Racks', 3, 312.40, 24.0, CURDATE() - INTERVAL 5 DAY, NOW()),
('Datacenter Server Racks', 3, 308.90, 24.0, CURDATE() - INTERVAL 4 DAY, NOW()),
('Datacenter Server Racks', 3, 315.00, 24.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('Datacenter Server Racks', 3, 311.20, 24.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('Datacenter Server Racks', 3, 309.50, 24.0, CURDATE() - INTERVAL 1 DAY, NOW()),
('Datacenter Server Racks', 3, 314.10, 24.0, CURDATE(), NOW()),

-- Vertical Transit (Elevators)
('Passenger Elevators Bank A', 0, 120.50, 16.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Passenger Elevators Bank A', 0, 128.00, 16.5, CURDATE() - INTERVAL 5 DAY, NOW()),
('Passenger Elevators Bank A', 0, 124.20, 16.0, CURDATE() - INTERVAL 4 DAY, NOW()),
('Passenger Elevators Bank A', 0, 132.80, 17.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('Passenger Elevators Bank A', 0, 126.50, 16.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('Passenger Elevators Bank A', 0, 115.00, 15.0, CURDATE() - INTERVAL 1 DAY, NOW()),
('Passenger Elevators Bank A', 0, 129.40, 16.5, CURDATE(), NOW()),

-- Water Distribution Pumps
('Basement Water Pumps', 0, 54.00, 8.0, CURDATE() - INTERVAL 6 DAY, NOW()),
('Basement Water Pumps', 0, 56.50, 8.5, CURDATE() - INTERVAL 5 DAY, NOW()),
('Basement Water Pumps', 0, 53.20, 8.0, CURDATE() - INTERVAL 4 DAY, NOW()),
('Basement Water Pumps', 0, 58.00, 9.0, CURDATE() - INTERVAL 3 DAY, NOW()),
('Basement Water Pumps', 0, 55.10, 8.0, CURDATE() - INTERVAL 2 DAY, NOW()),
('Basement Water Pumps', 0, 49.50, 7.5, CURDATE() - INTERVAL 1 DAY, NOW()),
('Basement Water Pumps', 0, 56.00, 8.5, CURDATE(), NOW());

-- ------------------------------------------------------------------------------
-- 3. Initial Sample Reports
-- ------------------------------------------------------------------------------
INSERT INTO reports (report_name, report_type, generated_date, file_path, total_consumption, total_cost) VALUES
('Weekly Building Efficiency Audit - Oct W1', 'WEEKLY', NOW() - INTERVAL 7 DAY, '/reports/weekly_audit_oct_w1.pdf', 9850.40, 78803.20),
('Monthly Corporate ESG Sustainability Report - Sep', 'MONTHLY', NOW() - INTERVAL 12 DAY, '/reports/monthly_esg_sep.pdf', 42120.00, 336960.00);
