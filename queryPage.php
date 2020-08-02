<?php

$conn = new PDO('mysql:host=localhost; dbname=schoolsystem', "root", "");

/*********** Check if Request is Json*********** */
if($_SERVER['CONTENT_TYPE'] == 'application/json'){
    $jsonDetails = json_decode(file_get_contents('php://input'), true) ?: [];
}

switch ($jsonDetails['fetch']) {
    case 'schools':
        /********** Fetch All Schools************** */
        $sch_query = $conn->query("SELECT s.*, COUNT(t.StaffID) as staff FROM schools s LEFT JOIN sch_staff t ON s.school_id = t.school_id WHERE s.status='1'  GROUP BY s.school_id ORDER BY s.school_name ASC");
        // print_r($sch_query);
        $schoolArr = getQuery($sch_query);
        
        echo json_encode(['schools'=>$schoolArr]);
        break;
    
    case 'schools_salary':
        /********** Fetch All Schools************** */
        $sch_query = $conn->query("SELECT s.*, COUNT(t.StaffID) as staff FROM schools s LEFT JOIN sch_staff t ON s.school_id = t.school_id WHERE s.status='1'  GROUP BY s.school_id ORDER BY s.school_name ASC");
        // print_r($sch_query);
        $schoolArr = getQuery($sch_query);
        
        $sal_qs = $conn->query("SELECT ps.school_id, SUM(p.grade_salary) as salary FROM `payroll_staff_grade_level` ps LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level GROUP BY ps.school_id");
        $salArr = getQuery($sal_qs);
        // $sal_query = $conn->query("SELECT ps.grade_salary FROM sch_staff st LEFT JOIN payroll_salary_structure ps ON st.StaffID=ps.staff_id WHERE ")
        
        echo json_encode(['schools'=>$schoolArr, 'salary'=>$salArr]);
        break;
    
    case 'staff':
        $sch_id = $jsonDetails['school'];
        $stf_query = $conn->query("SELECT st.*, g.grade_level, p.grade_salary FROM sch_staff st LEFT JOIN payroll_staff_grade_level g ON st.StaffID=g.staff_id LEFT JOIN payroll_salary_structure p ON g.grade_level=p.grade_level WHERE st.school_id='$sch_id' ORDER BY st.LastName ");
        // print_r($stf_query);
        echo json_encode(['staff'=>getQuery($stf_query)]);
        break;
    
    case 'school_payroll':
        $sch_id = $jsonDetails['school'];
        $stf_query = $conn->query("SELECT st.StaffID, st.Firstname, st.Lastname, st.Other_names, g.grade_level, p.grade_salary FROM sch_staff st LEFT JOIN payroll_staff_grade_level g ON st.StaffID=g.staff_id LEFT JOIN payroll_salary_structure p ON g.grade_level=p.grade_level WHERE st.school_id='$sch_id' ORDER BY st.Lastname ASC");
        $school = $conn->query("SELECT school_id, school_name from schools where school_id='$sch_id' LIMIT 1");
        // print_r($stf_query);
        $payroll_fields = $conn->query("SELECT * from payroll_fields where status='1' ");
        echo json_encode(['staff'=>getQuery($stf_query), 'fields'=>getQuery($payroll_fields), 'school'=>getQuery($school)]);
        break;

    case 'grade_level':
        $grade_qs = $conn->query("SELECT ps.*, COUNT(st.id) as staff_population FROM payroll_salary_structure ps LEFT JOIN payroll_staff_grade_level st ON ps.grade_level=st.grade_level GROUP BY ps.id ");
        echo json_encode(["grade_level"=>getQuery($grade_qs)]);
        break;
    
    default:
        # code...
        break;
}



/************Fxn to txform SQL Query Result to Array************* */
function getQuery($qs){
    $qArr = [];
    while ($item = $qs->fetch(PDO::FETCH_ASSOC)) {
        $qArr[] = $item;
    }
    return $qArr;
}

?>