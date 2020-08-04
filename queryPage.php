<?php

$conn = new PDO('mysql:host=localhost; dbname=schoolsystem', "root", "");

/*********** Check if Request is Json*********** */
if($_SERVER['CONTENT_TYPE'] == 'application/json'){
    $jsonDetails = json_decode(file_get_contents('php://input'), true) ?: [];
}

switch ($jsonDetails['fetch']) {
    case 'total_chart':
        $sch_query = $conn->query("SELECT ps.school_id, SUM(p.grade_salary) as salary, sc.Schoolname FROM `payroll_staff_grade_level` ps LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level LEFT JOIN sch_config sc ON ps.school_id=sc.school_id GROUP BY ps.school_id");

        echo json_encode(getQuery($sch_query));
        break;

    case 'schools':
        /********** Fetch All Schools************** */
        $sch_query = $conn->query("SELECT s.*, COUNT(t.StaffID) as staff FROM schools s LEFT JOIN sch_staff t ON s.school_id = t.school_id WHERE s.status='1'  GROUP BY s.school_id ORDER BY s.school_name ASC");
        // print_r($sch_query);
        $schoolArr = getQuery($sch_query);
        
        echo json_encode(['schools'=>$schoolArr]);
        break;
    
    case 'schools_salary':
        $payMonth = $jsonDetails['searchDate']['m'] + 1;
        $payYear = $jsonDetails['searchDate']['y'];
        /********** Fetch All Schools************** */
        $sch_query = $conn->query("SELECT s.*, COUNT(t.StaffID) as staff FROM schools s LEFT JOIN sch_staff t ON s.school_id = t.school_id WHERE s.status='1'  GROUP BY s.school_id ORDER BY s.school_name ASC");
        // print_r($sch_query);
        $schoolArr = getQuery($sch_query);
        
        $sal_qs = $conn->query("SELECT ps.school_id, SUM(p.grade_salary) as salary FROM `payroll_staff_grade_level` ps LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level GROUP BY ps.school_id");
        $salArr = getQuery($sal_qs);

        $pay_stats = $conn->query("SELECT id, school_id, pay_date FROM payroll_date WHERE month(pay_date) = '$payMonth' AND year(pay_date)='$payYear' ");
        // $sal_query = $conn->query("SELECT ps.grade_salary FROM sch_staff st LEFT JOIN payroll_salary_structure ps ON st.StaffID=ps.staff_id WHERE ")
        
        echo json_encode([
            'schools'=>$schoolArr, 
            'salary'=>$salArr, 
            'pay_stats'=>getQuery($pay_stats),
            'searchDate'=>$jsonDetails['searchDate']
            ]);
        break;
    
    case 'staff':
        $sch_id = $jsonDetails['school'];
        $sch_query = $conn->query("SELECT school_name from schools WHERE school_id='$sch_id'");
        $stf_query = $conn->query("SELECT st.*, g.grade_level, p.grade_salary FROM sch_staff st LEFT JOIN payroll_staff_grade_level g ON st.StaffID=g.staff_id LEFT JOIN payroll_salary_structure p ON g.grade_level=p.grade_level WHERE st.school_id='$sch_id' ORDER BY st.LastName ");
        // print_r($stf_query);
        echo json_encode(['staff'=>getQuery($stf_query), 'sch'=>getQuery($sch_query)]);
        break;
    
    case 'school_payroll':
        $sch_id = $jsonDetails['school'];
        $stf_query = $conn->query("SELECT st.StaffID, st.Firstname, st.Lastname, st.Other_names, g.grade_level, p.grade_salary FROM sch_staff st LEFT JOIN payroll_staff_grade_level g ON st.StaffID=g.staff_id LEFT JOIN payroll_salary_structure p ON g.grade_level=p.grade_level WHERE st.school_id='$sch_id' ORDER BY st.Lastname ASC");
        $school = $conn->query("SELECT school_id, school_name from schools where school_id='$sch_id' LIMIT 1");
        // print_r($stf_query);
        $payroll_fields = $conn->query("SELECT * from payroll_fields where status='1' ");
        echo json_encode([
            'staff'=>getQuery($stf_query), 
            'fields'=>getQuery($payroll_fields), 
            'school'=>getQuery($school),
            'date'=>$jsonDetails['date']
        ]);
        break;

    case 'grade_level':
        $grade_qs = $conn->query("SELECT ps.*, COUNT(st.id) as staff_population FROM payroll_salary_structure ps LEFT JOIN payroll_staff_grade_level st ON ps.grade_level=st.grade_level GROUP BY ps.id ");
        echo json_encode(["grade_level"=>getQuery($grade_qs)]);
        break;

    case 'check_payroll':
        $p_base = $jsonDetails['data']['payDate'];
        $sch_id = $jsonDetails['data']['school_id'];

        $checkQs = $conn->query("SELECT * FROM payroll_date WHERE month(pay_date)=month('$p_base') and year(pay_date)=year('$p_base') and school_id='$sch_id' ");

        echo json_encode(['check'=>getQuery($checkQs)]);

        break;
    
    case 'create_payroll':
        $p_base = $jsonDetails['data']['payDateObj'];
        $sch_id = $p_base['school_id'];
        $school_pay = $jsonDetails['data']['payPackObj'];

        $sch_det = $conn->query("SELECT school_name from schools where school_id='$sch_id' ")->fetch(PDO::FETCH_ASSOC)['school_name'];
        $insertBase = $conn->prepare("INSERT INTO payroll_date (school_id, pay_date, total_salary_paid) VALUES (?,?,?) ");
        $confirmBase = $insertBase->execute([$p_base['school_id'], $p_base['pay_date'], $p_base['total_salary']]);
        $pay_date_id = $conn->lastInsertId();
        if($confirmBase){
            foreach ($school_pay as $key => $val) {
                $insPay = $conn->prepare("INSERT INTO payroll(staff_id, school_id, payroll_date_id, grade_salary, bonus, overtime, absence, lateness, other_addition, other_deduction, net_pay) VALUES (?,?,?,?,?,?,?,?,?,?,?) ");
                $insPay->execute([$key, $val['school_id'], $pay_date_id, $val['grade_salary'], $val['bonus'], $val['overtime'], $val['absence'], $val['lateness'], $val['other_addition'], $val['other_deduction'], $val['net_salary']]);
            }
        }

        echo json_encode(['date'=>$p_base, "name"=>$sch_det]);
        break;

    case 'schools_report':
        $date_det = $jsonDetails['searchDate'];
        $mon = $date_det['m'] + 1;
        $yr = $date_det['y'];

        $totQs = $conn->query("SELECT SUM(total_salary_paid) as total_salary FROM payroll_date WHERE month(pay_date) = '$mon' AND year(pay_date)='$yr' ");
        $repQs = $conn->query("SELECT r.*, s.school_name, SUM(p.grade_salary) as salary FROM payroll_date r LEFT JOIN schools s ON r.school_id=s.school_id LEFT JOIN payroll_staff_grade_level ps ON r.school_id=ps.school_id  LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level WHERE month(r.pay_date) = '$mon' AND year(r.pay_date)='$yr'  GROUP BY r.school_id");

        // $payQs = $conn->query("SELECT ps.school_id, SUM(p.grade_salary) as salary, sc.Schoolname FROM `payroll_staff_grade_level` ps LEFT JOIN payroll_salary_structure p ON ps.grade_level=p.grade_level LEFT JOIN sch_config sc ON ps.school_id=sc.school_id GROUP BY ps.school_id");


        echo json_encode([
            'report'=>getQuery($repQs), 
            'total'=>getQuery($totQs),
            'searchDate'=>$date_det,
            ]);
        break;

    case 'payroll_report':
        $date_det = $jsonDetails['date'];
        // $mon = $date_det['m'] + 1;
        // $yr = $date_det['y'];
        $sch_id = $jsonDetails['school'];
        $payroll = $jsonDetails['payroll'];

        $school = $conn->query("SELECT school_id, school_name from schools where school_id='$sch_id' LIMIT 1");
        $payroll_fields = $conn->query("SELECT * from payroll_fields where status='1' ");

        $repQs = $conn->query("SELECT p.*, st.StaffID, st.Firstname, st.Lastname, st.Other_names FROM payroll p LEFT JOIN sch_staff st ON st.StaffID=p.staff_id WHERE p.payroll_date_id='$payroll' ");

        echo json_encode([
            'report'=>getQuery($repQs),
            'school'=>getQuery($school),
            'fields'=>getQuery($payroll_fields),
            'date'=>$date_det
            ]);
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