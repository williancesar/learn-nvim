-- =============================================================================
-- DAY 06: DELETE OPERATIONS - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Use 'x' to delete character under cursor
-- - Use 'X' to delete character before cursor
-- - Use 'dw' to delete word
-- - Use 'db' to delete word backward
-- - Use 'dd' to delete entire line
-- - Use 'D' to delete from cursor to end of line
-- - Use 'd$' to delete to end of line
-- - Use 'd0' to delete to beginning of line
-- - Practice delete with motions (d2w, d3j, etc.)
--
-- DELETION TARGETS:
-- This file contains heavily over-commented and redundant SQL code.
-- Practice delete operations to clean up:
-- - Excessive comments
-- - Redundant explanations
-- - Duplicate code blocks
-- - Verbose variable names
-- - Unnecessary debugging statements
-- - Redundant queries
-- =============================================================================

-- =============================================================================
-- HEALTHCARE DATABASE MANAGEMENT SYSTEM
-- This database is designed for managing healthcare records and patient data
-- It includes comprehensive tracking of patients, doctors, appointments,
-- medical records, prescriptions, and billing information
-- The schema follows industry best practices for healthcare data management
-- All tables include proper foreign key relationships and constraints
-- Performance optimization through strategic indexing is implemented
-- Data privacy and security measures are built into the design
-- HIPAA compliance considerations are incorporated throughout
-- =============================================================================

-- Database creation and initial setup procedures
-- This section handles the fundamental database creation process
-- It establishes the primary database container for all healthcare data
-- The database name follows organizational naming conventions
-- Character encoding is set to UTF-8 for international compatibility
-- Timezone settings are configured for accurate timestamp handling
CREATE DATABASE healthcare_management_system; -- Main database for healthcare operations

-- Schema usage declaration for organizational structure
-- This statement activates the newly created database
-- It ensures all subsequent operations target the correct database
-- Connection parameters are automatically inherited
-- Transaction isolation levels default to READ COMMITTED
USE healthcare_management_system; -- Activate the healthcare database for operations

-- Schema organization for logical data separation
-- Multiple schemas provide data organization and security boundaries
-- Each schema serves a specific functional area of the application
-- Access controls can be applied at the schema level for security
-- Maintenance operations can be performed on individual schemas
CREATE SCHEMA patient_data; -- Schema for all patient-related information and records
CREATE SCHEMA medical_staff; -- Schema for doctor, nurse, and staff information
CREATE SCHEMA clinical_data; -- Schema for medical records and clinical information
CREATE SCHEMA financial_data; -- Schema for billing, insurance, and payment information
CREATE SCHEMA administrative; -- Schema for system administration and configuration

-- =============================================================================
-- PATIENT INFORMATION MANAGEMENT TABLES
-- This section defines all tables related to patient data storage
-- Patient privacy and data protection are primary concerns
-- All personally identifiable information is properly secured
-- Audit trails are maintained for data access and modifications
-- Foreign key relationships ensure data integrity
-- =============================================================================

-- Primary patient information table definition
-- This table stores core demographic and contact information for patients
-- It serves as the central hub for all patient-related data relationships
-- Each patient record includes comprehensive identification information
-- Emergency contact details are maintained for safety protocols
-- Medical record numbers follow industry-standard formatting
-- Insurance information links to separate billing tables
-- Status tracking enables patient lifecycle management
CREATE TABLE patient_data.patients (
    patient_id SERIAL PRIMARY KEY, -- Unique identifier for each patient record in the system
    medical_record_number VARCHAR(20) UNIQUE NOT NULL, -- Hospital-assigned MRN for patient identification
    first_name VARCHAR(100) NOT NULL, -- Patient's legal first name from official documents
    middle_name VARCHAR(100), -- Optional middle name or initial if provided by patient
    last_name VARCHAR(100) NOT NULL, -- Patient's legal last name from official identification
    date_of_birth DATE NOT NULL, -- Birth date for age calculation and verification purposes
    gender VARCHAR(20), -- Gender identity as self-reported by the patient
    social_security_number VARCHAR(11), -- SSN for insurance and identification (encrypted storage)
    phone_primary VARCHAR(15), -- Primary contact phone number for appointment reminders
    phone_secondary VARCHAR(15), -- Secondary contact number for emergency situations
    email_address VARCHAR(255), -- Email for communication and appointment notifications
    address_line_1 VARCHAR(200), -- Primary street address for mailings and emergency contact
    address_line_2 VARCHAR(200), -- Apartment, suite, or additional address information
    city VARCHAR(100), -- City of residence for geographic tracking and service areas
    state_province VARCHAR(50), -- State or province for regional healthcare regulations
    postal_code VARCHAR(20), -- ZIP or postal code for service area determination
    country VARCHAR(50) DEFAULT 'United States', -- Country for international patient tracking
    emergency_contact_name VARCHAR(200), -- Full name of primary emergency contact person
    emergency_contact_phone VARCHAR(15), -- Phone number for emergency contact person
    emergency_contact_relationship VARCHAR(50), -- Relationship to patient (spouse, parent, etc.)
    primary_language VARCHAR(50) DEFAULT 'English', -- Preferred language for medical communication
    marital_status VARCHAR(20), -- Marital status for insurance and emergency contact purposes
    occupation VARCHAR(100), -- Occupation information for risk assessment and insurance
    employer_name VARCHAR(200), -- Employer name for insurance verification and billing
    insurance_provider VARCHAR(100), -- Primary insurance company name for billing purposes
    insurance_policy_number VARCHAR(50), -- Policy number for insurance claims processing
    insurance_group_number VARCHAR(50), -- Group number for employer-based insurance plans
    preferred_pharmacy VARCHAR(200), -- Preferred pharmacy for prescription fulfillment
    allergies TEXT, -- Known allergies and adverse reactions for safety protocols
    medical_conditions TEXT, -- Chronic conditions and ongoing health issues
    current_medications TEXT, -- List of current medications and dosages
    blood_type VARCHAR(5), -- Blood type for emergency medical situations
    organ_donor BOOLEAN DEFAULT FALSE, -- Organ donation status for emergency situations
    advance_directive BOOLEAN DEFAULT FALSE, -- Advance directive on file indicator
    patient_status VARCHAR(20) DEFAULT 'active', -- Current status: active, inactive, deceased
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date of initial registration
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of last record modification
    created_by VARCHAR(100), -- User ID of staff member who created the record
    updated_by VARCHAR(100) -- User ID of staff member who last updated the record
); -- End of patient information table definition

-- This is a duplicate comment that explains the same patient table
-- The table above already has comprehensive documentation
-- This redundant explanation should be removed to clean up the code
-- Patient data management is critical for healthcare operations
-- Data accuracy and completeness are essential for quality care
-- Regular data validation and cleanup procedures are necessary

-- Medical staff information table for healthcare providers
-- This table maintains records for all medical professionals
-- It includes licensing and credential verification information
-- Scheduling and patient assignment relationships are tracked
-- Performance metrics and evaluation data are maintained
-- Continuing education and certification tracking is included
CREATE TABLE medical_staff.healthcare_providers (
    provider_id SERIAL PRIMARY KEY, -- Unique identifier for healthcare provider
    employee_id VARCHAR(20) UNIQUE NOT NULL, -- Hospital employee identification number
    first_name VARCHAR(100) NOT NULL, -- Provider's first name from HR records
    last_name VARCHAR(100) NOT NULL, -- Provider's last name from employment documentation
    middle_initial CHAR(1), -- Middle initial if provided in employment records
    professional_title VARCHAR(100), -- Official job title (MD, RN, PA, etc.)
    department VARCHAR(100), -- Hospital department assignment for scheduling
    specialty VARCHAR(100), -- Medical specialty or area of expertise
    license_number VARCHAR(50), -- Professional license number for verification
    license_state VARCHAR(50), -- State where professional license was issued
    license_expiration DATE, -- Expiration date for license renewal tracking
    dea_number VARCHAR(20), -- DEA number for prescription authorization
    npi_number VARCHAR(20) UNIQUE, -- National Provider Identifier for billing
    board_certification VARCHAR(200), -- Board certification details and specialties
    medical_school VARCHAR(200), -- Medical school attended for credentialing
    graduation_year INTEGER, -- Year of graduation from medical school
    residency_program VARCHAR(200), -- Residency program and institution
    fellowship_program VARCHAR(200), -- Fellowship training if applicable
    years_experience INTEGER, -- Total years of medical practice experience
    phone_office VARCHAR(15), -- Office phone number for professional contact
    phone_mobile VARCHAR(15), -- Mobile phone for emergency contact
    email_work VARCHAR(255), -- Work email address for professional communication
    office_location VARCHAR(100), -- Physical office location within the facility
    schedule_template VARCHAR(50), -- Default scheduling template for appointments
    patient_capacity INTEGER, -- Maximum number of patients per day
    consultation_fee DECIMAL(10, 2), -- Standard consultation fee for billing
    insurance_networks TEXT, -- Accepted insurance networks for patient billing
    languages_spoken VARCHAR(200), -- Languages spoken for patient communication
    hire_date DATE, -- Date of employment start for HR records
    employment_status VARCHAR(20) DEFAULT 'active', -- Current employment status
    supervisor_id INTEGER, -- Reference to supervising physician if applicable
    performance_rating DECIMAL(3, 2), -- Annual performance evaluation score
    patient_satisfaction_score DECIMAL(3, 2), -- Patient satisfaction rating average
    continuing_education_hours INTEGER DEFAULT 0, -- CE hours completed this year
    malpractice_insurance_carrier VARCHAR(100), -- Malpractice insurance provider
    malpractice_policy_number VARCHAR(50), -- Malpractice insurance policy number
    background_check_date DATE, -- Date of last background check completion
    drug_screening_date DATE, -- Date of last drug screening test
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Last modification timestamp
    created_by VARCHAR(100), -- User who created the provider record
    updated_by VARCHAR(100) -- User who last updated the provider record
); -- End of healthcare provider table definition

-- The above table definition is comprehensive and well-documented
-- Additional explanatory comments here would be redundant
-- The field names are self-explanatory with proper documentation
-- Maintenance of this table requires regular license verification
-- Performance tracking enables quality improvement initiatives

-- =============================================================================
-- APPOINTMENT SCHEDULING AND MANAGEMENT SYSTEM
-- This section handles all aspects of patient appointment scheduling
-- Integration with provider schedules ensures optimal resource utilization
-- Automated reminder systems reduce no-show rates
-- Waitlist management optimizes appointment availability
-- Reporting capabilities support operational decision-making
-- =============================================================================

-- Comprehensive appointment tracking table
-- This table manages all patient appointments across the healthcare system
-- It supports complex scheduling scenarios and resource management
-- Integration with billing systems enables revenue tracking
-- Patient communication and reminder systems utilize this data
-- Reporting and analytics for operational efficiency are supported
CREATE TABLE clinical_data.appointments (
    appointment_id SERIAL PRIMARY KEY, -- Unique identifier for each appointment
    appointment_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable appointment reference
    patient_id INTEGER NOT NULL, -- Foreign key reference to patient record
    provider_id INTEGER NOT NULL, -- Foreign key reference to healthcare provider
    appointment_type VARCHAR(50) NOT NULL, -- Type of appointment (consultation, follow-up, etc.)
    appointment_date DATE NOT NULL, -- Scheduled date for the appointment
    appointment_time TIME NOT NULL, -- Scheduled time for the appointment start
    estimated_duration INTEGER DEFAULT 30, -- Estimated appointment duration in minutes
    actual_start_time TIMESTAMP, -- Actual time the appointment began
    actual_end_time TIMESTAMP, -- Actual time the appointment concluded
    appointment_status VARCHAR(20) DEFAULT 'scheduled', -- Current status of appointment
    chief_complaint TEXT, -- Primary reason for the visit as stated by patient
    appointment_notes TEXT, -- Additional notes about the appointment
    scheduling_priority VARCHAR(20) DEFAULT 'routine', -- Priority level for scheduling
    referring_provider_id INTEGER, -- Provider who referred the patient if applicable
    referral_reason TEXT, -- Reason for referral from other provider
    insurance_authorization VARCHAR(50), -- Insurance pre-authorization number
    copay_amount DECIMAL(8, 2), -- Patient copay amount for the visit
    estimated_charges DECIMAL(10, 2), -- Estimated total charges for the appointment
    room_assignment VARCHAR(20), -- Examination room assigned for the appointment
    special_instructions TEXT, -- Special instructions for staff or patient
    interpreter_needed BOOLEAN DEFAULT FALSE, -- Whether language interpreter is required
    interpreter_language VARCHAR(50), -- Language for interpreter if needed
    mobility_assistance BOOLEAN DEFAULT FALSE, -- Whether patient needs mobility assistance
    equipment_needed VARCHAR(200), -- Special equipment required for the appointment
    prep_instructions TEXT, -- Pre-appointment preparation instructions for patient
    follow_up_needed BOOLEAN DEFAULT FALSE, -- Whether follow-up appointment is required
    follow_up_timeframe VARCHAR(50), -- Recommended timeframe for follow-up
    no_show_flag BOOLEAN DEFAULT FALSE, -- Flag indicating if patient did not show
    cancellation_reason TEXT, -- Reason for appointment cancellation if applicable
    cancelled_by VARCHAR(100), -- Person who cancelled the appointment
    cancellation_date TIMESTAMP, -- Date and time of appointment cancellation
    reminder_sent BOOLEAN DEFAULT FALSE, -- Flag indicating if appointment reminder was sent
    reminder_method VARCHAR(50), -- Method used for appointment reminder
    confirmation_received BOOLEAN DEFAULT FALSE, -- Whether patient confirmed attendance
    checked_in_time TIMESTAMP, -- Time patient checked in for appointment
    checked_out_time TIMESTAMP, -- Time patient completed appointment and checked out
    waiting_time_minutes INTEGER, -- Total time patient waited beyond scheduled time
    satisfaction_survey_sent BOOLEAN DEFAULT FALSE, -- Post-appointment survey status
    billing_status VARCHAR(20) DEFAULT 'pending', -- Current billing status for appointment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Last record modification timestamp
    scheduled_by VARCHAR(100), -- Staff member who scheduled the appointment
    modified_by VARCHAR(100), -- Staff member who last modified the appointment
    -- Foreign key constraint definitions for data integrity
    FOREIGN KEY (patient_id) REFERENCES patient_data.patients(patient_id),
    FOREIGN KEY (provider_id) REFERENCES medical_staff.healthcare_providers(provider_id),
    FOREIGN KEY (referring_provider_id) REFERENCES medical_staff.healthcare_providers(provider_id)
); -- End of comprehensive appointment management table

-- This comment block provides redundant information about appointments
-- The table definition above already includes comprehensive documentation
-- Scheduling efficiency is critical for healthcare operations
-- Patient satisfaction depends on effective appointment management
-- Data accuracy ensures proper billing and insurance processing

-- =============================================================================
-- MEDICAL RECORDS AND CLINICAL DOCUMENTATION SYSTEM
-- This section manages all clinical documentation and medical records
-- HIPAA compliance and data security are primary considerations
-- Integration with electronic health record systems is supported
-- Clinical decision support tools utilize this structured data
-- Quality metrics and outcomes tracking are enabled through this design
-- =============================================================================

-- Comprehensive medical records table for clinical documentation
-- This table stores detailed medical information for each patient encounter
-- It supports evidence-based medicine and clinical decision support
-- Integration with billing systems ensures proper procedure coding
-- Research and quality improvement initiatives utilize this data
-- Audit trails maintain compliance with healthcare regulations
CREATE TABLE clinical_data.medical_records (
    record_id SERIAL PRIMARY KEY, -- Unique identifier for each medical record entry
    patient_id INTEGER NOT NULL, -- Foreign key linking to patient information
    provider_id INTEGER NOT NULL, -- Foreign key linking to attending physician
    appointment_id INTEGER, -- Optional foreign key to associated appointment
    encounter_date TIMESTAMP NOT NULL, -- Date and time of the medical encounter
    encounter_type VARCHAR(50) NOT NULL, -- Type of encounter (office visit, hospital admission, etc.)
    chief_complaint TEXT, -- Primary complaint or reason for the visit as stated by patient
    history_of_present_illness TEXT, -- Detailed history of current symptoms and concerns
    review_of_systems TEXT, -- Systematic review of body systems and symptoms
    past_medical_history TEXT, -- Previous medical conditions and surgical history
    family_history TEXT, -- Relevant family medical history and genetic factors
    social_history TEXT, -- Social factors affecting health (smoking, alcohol, etc.)
    current_medications TEXT, -- List of current medications with dosages and frequencies
    allergies_and_reactions TEXT, -- Known allergies and adverse drug reactions
    vital_signs_temperature DECIMAL(4, 1), -- Body temperature in Fahrenheit
    vital_signs_blood_pressure_systolic INTEGER, -- Systolic blood pressure measurement
    vital_signs_blood_pressure_diastolic INTEGER, -- Diastolic blood pressure measurement
    vital_signs_heart_rate INTEGER, -- Heart rate in beats per minute
    vital_signs_respiratory_rate INTEGER, -- Respiratory rate in breaths per minute
    vital_signs_oxygen_saturation DECIMAL(5, 2), -- Oxygen saturation percentage
    vital_signs_height_inches DECIMAL(5, 2), -- Patient height in inches
    vital_signs_weight_pounds DECIMAL(6, 2), -- Patient weight in pounds
    vital_signs_bmi DECIMAL(5, 2), -- Calculated body mass index
    physical_examination_findings TEXT, -- Detailed physical examination results
    assessment_and_diagnosis TEXT, -- Clinical assessment and diagnostic impressions
    diagnostic_test_orders TEXT, -- Laboratory tests and diagnostic imaging ordered
    treatment_plan TEXT, -- Therapeutic interventions and treatment recommendations
    prescriptions_ordered TEXT, -- Medications prescribed during this encounter
    referrals_made TEXT, -- Referrals to specialists or other healthcare providers
    patient_education_provided TEXT, -- Educational materials and counseling provided
    follow_up_instructions TEXT, -- Instructions for follow-up care and appointments
    progress_notes TEXT, -- Additional notes on patient progress and response to treatment
    complications_noted TEXT, -- Any complications or adverse events during treatment
    procedures_performed TEXT, -- Medical procedures performed during this encounter
    billing_codes_icd10 TEXT, -- ICD-10 diagnosis codes for billing and documentation
    billing_codes_cpt TEXT, -- CPT procedure codes for billing and documentation
    dictation_status VARCHAR(20) DEFAULT 'pending', -- Status of clinical documentation
    transcription_completed BOOLEAN DEFAULT FALSE, -- Whether dictation has been transcribed
    physician_signature BOOLEAN DEFAULT FALSE, -- Whether physician has signed the record
    signature_date TIMESTAMP, -- Date and time of physician signature
    quality_review_completed BOOLEAN DEFAULT FALSE, -- Whether quality review is complete
    reviewed_by VARCHAR(100), -- Quality reviewer who examined the record
    review_date TIMESTAMP, -- Date of quality review completion
    amendments_count INTEGER DEFAULT 0, -- Number of amendments made to this record
    confidentiality_level VARCHAR(20) DEFAULT 'standard', -- Confidentiality classification
    research_consent BOOLEAN DEFAULT FALSE, -- Whether patient consented to research use
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Last modification timestamp
    created_by VARCHAR(100), -- Healthcare provider who created the record
    updated_by VARCHAR(100), -- Last person to modify the record
    -- Foreign key constraints for referential integrity
    FOREIGN KEY (patient_id) REFERENCES patient_data.patients(patient_id),
    FOREIGN KEY (provider_id) REFERENCES medical_staff.healthcare_providers(provider_id),
    FOREIGN KEY (appointment_id) REFERENCES clinical_data.appointments(appointment_id)
); -- End of comprehensive medical records table definition

-- Additional commentary about medical records management
-- The above table captures comprehensive clinical information
-- Electronic health records improve care coordination
-- Structured data supports clinical decision support systems
-- Quality metrics can be derived from this clinical data

-- =============================================================================
-- BILLING AND FINANCIAL MANAGEMENT SYSTEM
-- This section handles all financial aspects of healthcare operations
-- Insurance processing and claims management are core functionalities
-- Revenue cycle management and accounts receivable tracking are supported
-- Financial reporting and analytics capabilities are included
-- Compliance with healthcare billing regulations is maintained
-- =============================================================================

-- Comprehensive billing transactions table
-- This table manages all financial transactions and billing activities
-- It supports complex insurance processing and payment tracking
-- Integration with accounting systems enables financial reporting
-- Audit trails ensure compliance with healthcare billing regulations
-- Revenue cycle analytics support operational decision-making
CREATE TABLE financial_data.billing_transactions (
    transaction_id SERIAL PRIMARY KEY, -- Unique identifier for each billing transaction
    invoice_number VARCHAR(30) UNIQUE NOT NULL, -- Human-readable invoice reference number
    patient_id INTEGER NOT NULL, -- Foreign key reference to patient being billed
    provider_id INTEGER NOT NULL, -- Foreign key reference to service provider
    appointment_id INTEGER, -- Optional reference to associated appointment
    medical_record_id INTEGER, -- Optional reference to associated medical record
    service_date DATE NOT NULL, -- Date when the billable service was provided
    billing_date DATE DEFAULT CURRENT_DATE, -- Date when the billing entry was created
    service_description TEXT NOT NULL, -- Detailed description of the service provided
    procedure_code VARCHAR(20), -- CPT or HCPCS procedure code for the service
    diagnosis_code VARCHAR(20), -- ICD-10 diagnosis code supporting the service
    quantity INTEGER DEFAULT 1, -- Quantity of services provided (e.g., units, visits)
    unit_charge DECIMAL(10, 2) NOT NULL, -- Charge per unit of service
    total_charge DECIMAL(12, 2) NOT NULL, -- Total charge for this line item
    insurance_primary_carrier VARCHAR(100), -- Primary insurance company name
    insurance_primary_policy VARCHAR(50), -- Primary insurance policy number
    insurance_primary_group VARCHAR(50), -- Primary insurance group number
    insurance_primary_authorization VARCHAR(50), -- Authorization number from primary insurance
    insurance_primary_copay DECIMAL(8, 2), -- Copay amount for primary insurance
    insurance_primary_deductible DECIMAL(10, 2), -- Deductible amount for primary insurance
    insurance_primary_coinsurance_percent DECIMAL(5, 2), -- Coinsurance percentage
    insurance_secondary_carrier VARCHAR(100), -- Secondary insurance company if applicable
    insurance_secondary_policy VARCHAR(50), -- Secondary insurance policy number
    insurance_secondary_group VARCHAR(50), -- Secondary insurance group number
    patient_responsibility DECIMAL(10, 2), -- Amount patient is responsible for paying
    insurance_claim_number VARCHAR(50), -- Claim number from insurance submission
    claim_submission_date DATE, -- Date insurance claim was submitted
    claim_status VARCHAR(30) DEFAULT 'pending', -- Current status of insurance claim
    claim_denial_reason TEXT, -- Reason for claim denial if applicable
    payment_received_amount DECIMAL(10, 2) DEFAULT 0.00, -- Amount actually received
    payment_received_date DATE, -- Date payment was received
    payment_method VARCHAR(30), -- Method of payment (check, electronic, etc.)
    payment_reference VARCHAR(50), -- Payment reference number or check number
    adjustment_amount DECIMAL(10, 2) DEFAULT 0.00, -- Any adjustments to the original charge
    adjustment_reason TEXT, -- Reason for charge adjustment
    write_off_amount DECIMAL(10, 2) DEFAULT 0.00, -- Amount written off as uncollectible
    write_off_reason TEXT, -- Reason for write-off
    collection_status VARCHAR(30) DEFAULT 'current', -- Current collection status
    collection_agency VARCHAR(100), -- Collection agency if account is sent to collections
    collection_date DATE, -- Date account was sent to collections
    dispute_flag BOOLEAN DEFAULT FALSE, -- Whether patient has disputed the charge
    dispute_reason TEXT, -- Reason for patient dispute
    dispute_resolution TEXT, -- Resolution of patient dispute
    refund_amount DECIMAL(10, 2) DEFAULT 0.00, -- Amount refunded to patient or insurance
    refund_date DATE, -- Date refund was processed
    refund_reason TEXT, -- Reason for refund
    billing_notes TEXT, -- Additional notes about the billing transaction
    revenue_cycle_stage VARCHAR(30) DEFAULT 'billed', -- Current stage in revenue cycle
    days_in_ar INTEGER, -- Days this charge has been in accounts receivable
    follow_up_date DATE, -- Date for next follow-up action
    assigned_collector VARCHAR(100), -- Staff member assigned to collect on this account
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Transaction creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Last modification timestamp
    created_by VARCHAR(100), -- User who created the billing transaction
    updated_by VARCHAR(100), -- User who last updated the transaction
    -- Foreign key constraints for data integrity
    FOREIGN KEY (patient_id) REFERENCES patient_data.patients(patient_id),
    FOREIGN KEY (provider_id) REFERENCES medical_staff.healthcare_providers(provider_id),
    FOREIGN KEY (appointment_id) REFERENCES clinical_data.appointments(appointment_id),
    FOREIGN KEY (medical_record_id) REFERENCES clinical_data.medical_records(record_id)
); -- End of comprehensive billing transactions table

-- This is another redundant comment block about billing
-- The billing table above already has comprehensive documentation
-- Financial accuracy is critical for healthcare operations
-- Revenue cycle management affects organizational sustainability
-- Patient satisfaction is impacted by billing clarity and accuracy

-- =============================================================================
-- DUPLICATE QUERY SECTION - SHOULD BE CLEANED UP
-- The following queries are redundant and should be removed
-- They provide the same functionality as queries defined elsewhere
-- Maintaining duplicate code creates maintenance overhead
-- Performance may be impacted by redundant query execution
-- Code clarity is reduced by duplicate implementations
-- =============================================================================

-- This is a duplicate patient summary query that already exists elsewhere
-- The same functionality is provided by other queries in this file
-- This redundant implementation should be removed to clean up the codebase
-- Patient summary reporting is already handled by more comprehensive queries
-- Duplicate code creates confusion and maintenance overhead
SELECT
    p.patient_id, -- Patient unique identifier from the patients table
    p.first_name, -- Patient first name for identification purposes
    p.last_name, -- Patient last name for identification purposes
    p.date_of_birth, -- Patient birth date for age calculation
    COUNT(a.appointment_id) AS total_appointments, -- Count of all appointments for this patient
    MAX(a.appointment_date) AS last_appointment_date, -- Most recent appointment date
    COUNT(mr.record_id) AS total_medical_records -- Count of medical records for this patient
FROM patient_data.patients p -- Main patients table with demographic information
LEFT JOIN clinical_data.appointments a ON p.patient_id = a.patient_id -- Join with appointments
LEFT JOIN clinical_data.medical_records mr ON p.patient_id = mr.patient_id -- Join with records
GROUP BY p.patient_id, p.first_name, p.last_name, p.date_of_birth -- Group by patient attributes
ORDER BY p.last_name, p.first_name; -- Sort results by patient name

-- Another duplicate query for provider statistics
-- This query duplicates functionality available in other reporting queries
-- The same data can be obtained through more comprehensive reporting views
-- Removing this duplicate will improve code maintainability
-- Provider performance metrics are already tracked in other queries
SELECT
    hp.provider_id, -- Healthcare provider unique identifier
    hp.first_name, -- Provider first name for identification
    hp.last_name, -- Provider last name for identification
    hp.specialty, -- Medical specialty of the provider
    COUNT(a.appointment_id) AS total_appointments, -- Total appointments for this provider
    AVG(a.estimated_duration) AS average_appointment_duration, -- Average appointment length
    COUNT(mr.record_id) AS total_medical_records -- Medical records created by this provider
FROM medical_staff.healthcare_providers hp -- Main healthcare providers table
LEFT JOIN clinical_data.appointments a ON hp.provider_id = a.provider_id -- Join appointments
LEFT JOIN clinical_data.medical_records mr ON hp.provider_id = mr.provider_id -- Join records
GROUP BY hp.provider_id, hp.first_name, hp.last_name, hp.specialty -- Group by provider
ORDER BY total_appointments DESC; -- Sort by appointment volume

-- Yet another redundant billing summary query
-- This query provides the same information as other billing reports
-- Duplicate billing queries create confusion in financial reporting
-- A single comprehensive billing view would be more appropriate
-- This redundant code should be eliminated to improve clarity
SELECT
    bt.patient_id, -- Patient identifier for billing association
    SUM(bt.total_charge) AS total_charges, -- Sum of all charges for the patient
    SUM(bt.payment_received_amount) AS total_payments, -- Sum of all payments received
    SUM(bt.total_charge - bt.payment_received_amount) AS outstanding_balance, -- Calculate balance
    COUNT(bt.transaction_id) AS total_transactions -- Count of billing transactions
FROM financial_data.billing_transactions bt -- Main billing transactions table
GROUP BY bt.patient_id -- Group by patient for summary
HAVING SUM(bt.total_charge - bt.payment_received_amount) > 0 -- Only patients with balances
ORDER BY outstanding_balance DESC; -- Sort by balance amount

-- =============================================================================
-- VERBOSE AND OVER-COMMENTED ANALYTICAL QUERIES
-- This section contains queries with excessive documentation
-- The comments are repetitive and should be streamlined
-- Variable names are unnecessarily verbose and should be simplified
-- Query logic is straightforward but obscured by excessive comments
-- Performance may be impacted by overly complex alias names
-- =============================================================================

-- Extremely verbose patient demographics analysis with excessive commenting
-- This query analyzes patient demographics across multiple dimensions
-- Age group analysis provides insights into patient population characteristics
-- Geographic distribution analysis supports service planning decisions
-- Insurance coverage analysis aids in financial planning and contracting
-- Gender and marital status analysis supports targeted health programs
-- The results can be used for population health management initiatives
WITH patient_demographics_analysis_comprehensive_breakdown AS (
    SELECT
        p.patient_id AS unique_patient_identifier_primary_key, -- Primary key for patient identification
        p.first_name AS patient_first_name_from_registration, -- First name as entered during registration
        p.last_name AS patient_family_name_from_documentation, -- Last name from official documentation
        p.date_of_birth AS patient_birth_date_for_age_calculation, -- Birth date for demographic analysis
        EXTRACT(YEAR FROM AGE(p.date_of_birth)) AS calculated_patient_age_in_years, -- Age calculation
        CASE -- Age group categorization for demographic analysis purposes
            WHEN EXTRACT(YEAR FROM AGE(p.date_of_birth)) < 18 THEN 'Pediatric_Population_Under_18'
            WHEN EXTRACT(YEAR FROM AGE(p.date_of_birth)) BETWEEN 18 AND 30 THEN 'Young_Adult_18_to_30'
            WHEN EXTRACT(YEAR FROM AGE(p.date_of_birth)) BETWEEN 31 AND 50 THEN 'Middle_Aged_31_to_50'
            WHEN EXTRACT(YEAR FROM AGE(p.date_of_birth)) BETWEEN 51 AND 65 THEN 'Mature_Adult_51_to_65'
            ELSE 'Senior_Population_Over_65'
        END AS age_group_demographic_classification, -- Age group for demographic reporting
        p.gender AS patient_reported_gender_identity, -- Gender as reported by patient
        p.marital_status AS current_marital_status_classification, -- Marital status category
        p.city AS patient_residence_city_location, -- City where patient resides
        p.state_province AS patient_residence_state_or_province, -- State/province of residence
        p.insurance_provider AS primary_insurance_carrier_name, -- Primary insurance company
        p.patient_status AS current_patient_status_classification -- Active/inactive status
    FROM patient_data.patients p -- Main patient information table
    WHERE p.patient_status = 'active' -- Only include currently active patients
),
comprehensive_appointment_statistics_by_patient AS (
    SELECT
        a.patient_id AS patient_identifier_for_appointment_linkage, -- Patient ID for joining
        COUNT(a.appointment_id) AS total_appointment_count_all_time, -- Total appointments ever
        COUNT(CASE WHEN a.appointment_date >= CURRENT_DATE - INTERVAL '12 months'
              THEN a.appointment_id END) AS appointments_within_last_twelve_months,
        COUNT(CASE WHEN a.appointment_status = 'completed'
              THEN a.appointment_id END) AS successfully_completed_appointment_count,
        COUNT(CASE WHEN a.no_show_flag = TRUE
              THEN a.appointment_id END) AS total_no_show_appointment_count,
        MAX(a.appointment_date) AS most_recent_appointment_date_scheduled,
        MIN(a.appointment_date) AS earliest_appointment_date_on_record
    FROM clinical_data.appointments a -- Appointment scheduling table
    GROUP BY a.patient_id -- Group by patient for statistical aggregation
)
SELECT
    pda.age_group_demographic_classification, -- Age group category
    pda.patient_reported_gender_identity, -- Gender classification
    pda.patient_residence_state_or_province, -- State/province location
    COUNT(pda.unique_patient_identifier_primary_key) AS total_patient_count_in_demographic,
    AVG(pda.calculated_patient_age_in_years) AS average_age_within_demographic_group,
    COUNT(CASE WHEN cas.total_appointment_count_all_time > 0
          THEN pda.unique_patient_identifier_primary_key END) AS patients_with_appointments,
    AVG(COALESCE(cas.total_appointment_count_all_time, 0)) AS average_appointments_per_patient,
    COUNT(CASE WHEN pda.primary_insurance_carrier_name IS NOT NULL
          THEN pda.unique_patient_identifier_primary_key END) AS patients_with_insurance_coverage
FROM patient_demographics_analysis_comprehensive_breakdown pda -- Demographics CTE
LEFT JOIN comprehensive_appointment_statistics_by_patient cas
    ON pda.unique_patient_identifier_primary_key = cas.patient_identifier_for_appointment_linkage
GROUP BY
    pda.age_group_demographic_classification,
    pda.patient_reported_gender_identity,
    pda.patient_residence_state_or_province
ORDER BY
    pda.age_group_demographic_classification,
    total_patient_count_in_demographic DESC;

-- =============================================================================
-- REDUNDANT INDEX CREATION STATEMENTS
-- The following index definitions are duplicates of indexes already created
-- Multiple indexes on the same columns create unnecessary storage overhead
-- Database performance may be degraded by redundant index maintenance
-- Query optimizer confusion may result from duplicate index choices
-- These redundant indexes should be removed to optimize database performance
-- =============================================================================

-- Duplicate index on patient email - this index already exists elsewhere
-- The patients table already has an index on the email_address column
-- Creating duplicate indexes wastes storage space and degrades performance
-- Index maintenance overhead is doubled with redundant indexes
-- Query optimizer may make suboptimal choices with duplicate indexes
CREATE INDEX idx_patients_email_duplicate ON patient_data.patients (email_address);

-- Another duplicate index on provider NPI number
-- The healthcare_providers table already indexes the npi_number column
-- This redundant index should be removed to eliminate maintenance overhead
-- Unique constraints already provide index functionality for lookups
-- Storage space is wasted with unnecessary duplicate indexes
CREATE INDEX idx_providers_npi_duplicate ON medical_staff.healthcare_providers (npi_number);

-- Redundant compound index on appointments
-- This same combination of columns is already indexed in the table definition
-- Multiple indexes on identical column combinations provide no benefit
-- Database maintenance operations are slowed by redundant indexes
-- Storage requirements are unnecessarily increased by duplicate indexes
CREATE INDEX idx_appointments_patient_date_duplicate
ON clinical_data.appointments (patient_id, appointment_date);

-- =============================================================================
-- DEBUGGING AND TEMPORARY QUERIES
-- The following queries were used for debugging and should be removed
-- Temporary development queries create clutter in production code
-- Performance testing queries should not remain in production files
-- Debug output statements provide no value in production environments
-- These temporary artifacts should be cleaned up before deployment
-- =============================================================================

-- Temporary debugging query to check patient count
-- This query was used during development for data validation
-- It serves no purpose in production and should be removed
-- Development artifacts should not remain in production code
-- Cleanup of temporary queries improves code maintainability
SELECT COUNT(*) AS total_patient_count_debug FROM patient_data.patients;

-- Debug query for checking appointment status distribution
-- This was a temporary query for development testing purposes
-- Production code should not contain debugging artifacts
-- Temporary queries create confusion in production environments
-- These debug statements should be removed before deployment
SELECT appointment_status, COUNT(*) AS status_count_debug
FROM clinical_data.appointments
GROUP BY appointment_status;

-- Another temporary query for billing validation during development
-- This debug query was used to verify billing data during testing
-- Temporary development queries should not be included in production
-- Debug code creates maintenance overhead and confusion
-- All temporary artifacts should be cleaned up before release
SELECT
    COUNT(*) AS total_billing_records_debug,
    SUM(total_charge) AS total_charges_debug,
    AVG(total_charge) AS average_charge_debug
FROM financial_data.billing_transactions;

-- =============================================================================
-- DELETE OPERATION PRACTICE EXERCISES:
--
-- 1. CHARACTER DELETION:
--    - Use 'x' to delete excessive dashes in comment lines
--    - Use 'X' to remove extra spaces before comments
--    - Clean up formatting inconsistencies
--
-- 2. WORD DELETION:
--    - Use 'dw' to delete redundant words in comments
--    - Remove verbose adjectives and unnecessary descriptors
--    - Clean up overly long variable names
--
-- 3. LINE DELETION:
--    - Use 'dd' to remove entire redundant comment blocks
--    - Delete duplicate query definitions
--    - Remove debugging and temporary queries
--
-- 4. PARTIAL LINE DELETION:
--    - Use 'D' to delete from cursor to end of line
--    - Use 'd$' to remove excessive comments from line ends
--    - Use 'd0' to remove indentation and leading comments
--
-- 5. MOTION-BASED DELETION:
--    - Use 'd2w' to delete 2 words at once
--    - Use 'd3j' to delete 3 lines downward
--    - Use 'dt;' to delete until semicolon
--
-- 6. CLEANUP TARGETS:
--    - Remove all duplicate index creation statements
--    - Delete redundant comment blocks
--    - Clean up verbose variable names
--    - Remove all debugging queries
--    - Eliminate duplicate query definitions
-- =============================================================================