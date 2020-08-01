<?php

ini_set('max_execution_time', '0');

$conn = new PDO("mysql:host=localhost; dbname=schoolsystem", "root", "");

$qs = $conn->query("SELECT StaffID, school_id FROM sch_staff");

while($staff = $qs->fetch(PDO::FETCH_ASSOC)){
    $stID = $staff['StaffID'];
    $scID = $staff['school_id'];
    $GL = "0".random_int(1, 10);

    $inGL = $conn->query("INSERT INTO payroll_staff_grade_level(staff_id, school_id, grade_level) VALUES ('$stID', '$scID', '$GL')");

    if ($inGL) {
        echo $stID." GL:".$GL."<br>";
    }
}



?>