-- ==============================================================================
-- Smart Building Energy Management System - Database Schema (MySQL 8.0+)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS smart_energy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_energy_db;

-- ------------------------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS energy_data;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 2. Table: energy_data
-- ------------------------------------------------------------------------------
CREATE TABLE energy_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    floor_number INT NOT NULL,
    consumption DOUBLE NOT NULL COMMENT 'Consumption in kWh',
    operating_hours DOUBLE NOT NULL COMMENT 'Hours operated in day',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_energy_date (date),
    INDEX idx_energy_device (device_name),
    INDEX idx_energy_floor (floor_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 3. Table: reports
-- ------------------------------------------------------------------------------
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(150) NOT NULL,
    report_type VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255) NOT NULL,
    total_consumption DOUBLE DEFAULT 0.0,
    total_cost DOUBLE DEFAULT 0.0,
    INDEX idx_report_date (generated_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
