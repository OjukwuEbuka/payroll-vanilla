CREATE TABLE payroll_salary_structure (
	id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
	grade_level VARCHAR(11) NOT NULL,
	grade_salary DECIMAL(10, 2) NOT NULL,
	status ENUM('0', '1') DEFAULT '1',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO payroll_salary_structure (grade_level, grade_salary) VALUES 
('01', '12153.00'), ('02', '13400.00'), ('03', '15013.00'), ('04', '16818.00'),
('05', '18839.00'), ('06', '21099.00'), ('07', '23629.00'), ('08', '26698.00'),
('09', '29905.00'), ('10', '33491.00'), ('12', '37512.00'), ('13', '42018.00'),
('14', '47055.00'), ('15', '52705.00'), ('16', '59031.00');

CREATE TABLE payroll_fields (
	id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
	field_name VARCHAR(100) NOT NULL,
	field_description VARCHAR(300) NOT NULL,
	status ENUM('0', '1') DEFAULT '1' NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payroll_date(
	id INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
	pay_date DATE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO payroll_fields (field_name, field_description, status) VALUES
('Bonus', 'Bonus pay to staff.', '1'), ('Overtime', 'Pay for overtime work.', '1'),
('Absence', 'Deduction for absence from work.', '1'), ('Lateness', 'Deduction for lateness to work.', '1'),
('Other addition', 'Any other pay additions.', '1'), ('Other deduction', 'Any other pay deductions.', '1');

CREATE TABLE payroll (
	id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
	staff_id VARCHAR(100) NOT NULL,
	school_id INT(11) NOT NULL,
	payroll_date_id INT(11) NOT NULL,
	grade_salary DECIMAL(10, 2) NOT NULL,
	bonus DECIMAL(10, 2) NULL,
	overtime DECIMAL(10, 2) NULL,
	absence DECIMAL(10, 2) NULL,
	lateness DECIMAL(10, 2) NULL,
	other_addition DECIMAL(10, 2) NULL,
	other_deduction DECIMAL(10, 2) NULL,
	net_pay DECIMAL(10, 2) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payroll_staff_grade_level(
	id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
	staff_id VARCHAR(100) NOT NULL,
	school_id INT(11) NOT NULL,
	grade_level VARCHAR(11) NOT NULL,
	date_promoted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE payroll_staff_grade_level CHANGE staff_id staff_id VARCHAR(100) NOT NULL;

-- SELECT ps.*, p.grade_salary FROM `payroll_staff_grade_level` ps LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level where school_id = 17
-- SELECT SUM(p.grade_salary) FROM `payroll_staff_grade_level` ps LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level where school_id = 17

-- ALTER TABLE payroll_fields ADD COLUMN field_action VARCHAR(50) NOT NULL AFTER field_description;
-- ALTER TABLE payroll_fields ADD COLUMN field_slug VARCHAR(200) NOT NULL AFTER field_description;
-- UPDATE payroll_fields SET field_action='add';