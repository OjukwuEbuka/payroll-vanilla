/******* FUNCTION TO CREATE SCHOOLS TABLE******** */
function schoolsTable(res){
    let snum = 1;
    let schoolTable = `<table class='table table-bordered table-striped table-sm' >
        <thead>
            <th>S/No.</th>
            <th>Name</th>
            <th>Staff Size</th>
            <th>View Staff</th>
        <thead>
        <tbody>
    `;
    res.schools.forEach(sch => schoolTable += `
        <tr id='${sch.school_id}'>
            <td>${snum++}</td>
            <td>${sch.school_name}</td>
            <td class='text-center'>${sch.staff}</td>
            <td class='text-center'><button class='btn btn-outline-primary btn-sm viewStaffBtn'  data-sch='${sch.school_id}'>View</button></td>
        </tr>
        `
    );
    schoolTable += '</tbody></table>'
    return schoolTable;
}

/******* FUNCTION TO CREATE SCHOOLS SALARY TABLE******** */
function schoolsSalaryTable(res){
    let snum = 1;
    let schoolTable = `<table class='table table-bordered table-striped table-sm' >
        <thead>
            <th>S/No.</th>
            <th>Name</th>
            <th>Staff Size</th>
            <th>Total Salary</th>
            <th>View Payroll</th>
        <thead>
        <tbody>
    `;
    let staffSalary = res.salary.reduce((acc, sch) => {return {...acc, [sch.school_id]: sch.salary}}, {});
    // console.log(staffSalary);
    res.schools.forEach(sch => schoolTable += `
        <tr id='${sch.school_id}'>
            <td>${snum++}</td>
            <td>${sch.school_name}</td>
            <td class='text-center'>${sch.staff}</td>
            <td>${staffSalary[sch.school_id]}</td>
            <td class='text-center'><button class='btn btn-outline-primary btn-sm schoolPayrollBtn'  data-sch='${sch.school_id}'>Review</button></td>
        </tr>
        `
    );
    schoolTable += '</tbody></table>'
    return schoolTable;
}

/******* FUNCTION TO CREATE STAFF TABLE******** */
function staffTableFxn(res){
    let snum = 1;
    let staffTable = `<table class='table table-bordered table-striped table-sm' >
        <thead>
            <th>S/No.</th>
            <th>Name</th>
            <th>Staff ID</th>
            <th>Grade Level</th>
            <th>View Profile</th>
        <thead>
        <tbody>
    `;
    res.staff.forEach(st => staffTable += `
        <tr id='${st.StaffID}'>
            <td>${snum++}</td>
            <td>${st.Lastname+' '+st.Firstname+' '+st.Other_names}</td>
            <td class='text-center'>${st.StaffID}</td>
            <td class='text-center'>${st.grade_level}</td>
            <td class='text-center'>
                <button class='btn btn-outline-primary btn-sm staffProfileBtn'  
                data-st='${st.StaffID}' data-toggle='modal' data-target='#payrollModal'>
                    View
                </button></td>
        </tr>
        `
    );
    staffTable += '</tbody></table>'
    return staffTable;
}


/******* FUNCTION TO CREATE STAFF SALARY TABLE******** */
function staffSalaryTableFxn(res){
    let snum = 1;
    let pay_heads = '';
    let pay_fields = '';
    res.fields.forEach(field => {
        pay_heads += `<th>${field.field_name}</th>`;
        pay_fields += `<td><input type='number' class='payinp ${field.field_slug}' data-action='${field.field_action}'></td>`
    })
    let staffTable = `        
        <div class='row bg-secondary pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12 col-md-4 pb-2'> Date: <input type=date> </div>
            <div class='col-12 pt-1 border-top border-light'>
                <h3 class='text-center'>${res.schoolName}</h3>
            </div>
        </div>
        <div class='row'>
            <button class='btn btn-secondary' id='generalBonus'>ADD GENERAL BONUS</button>
        </div>
        <table class='table table-bordered table-striped table-sm table-responsive mt-2' >
        <thead class='bg-secondary text-white text-center'>
            <th>S/No.</th>
            <th>Name</th>
            <th>Salary</th>
            ${pay_heads}
            <th>Net Pay</th>
        <thead>
        <tbody>
    `;
    res.staff.forEach(st => staffTable += `
        <tr id='${st.StaffID}'>
            <td>${snum++}</td>
            <td>${st.Lastname+' '+st.Firstname+' '+st.Other_names}</td>            
            <td class='gradeSalary'>${st.grade_salary}</td>
            ${pay_fields}
            <td class='netSalary'>${st.grade_salary}</td>
        </tr>
        `
    );
    staffTable += `
        </tbody>
        </table>
        <button class='mt-4 mb-4 btn btn-block btn-secondary'> SUBMIT PAYROLL </button>`
    return staffTable;
}



/*******FUNCTION TO CREATE GRADE LEVEL TABLE****** */
const gradeLevelTableFxn = res => {
    let sNum = 1;
    let grade_rows = '';
    res.grade_level.forEach(grade => grade_rows += `
        <tr>
            <td>${sNum++}</td>
            <td>${grade.grade_level}</td>
            <td>${grade.grade_salary}</td>
            <td>${grade.staff_population}</td>
        </tr>
        `
        );

    let glTable = `<table class='table table-bordered table-striped' >
        <thead>
            <th>S/No.</th>
            <th>Grade Level</th>
            <th>Salary (Naira)</th>
            <th>Population</th>
        <thead>
        <tbody>
        ${grade_rows}
        </tbody>
        </table>
    `;

    return glTable;

}

export {schoolsTable, staffTableFxn, schoolsSalaryTable, staffSalaryTableFxn, gradeLevelTableFxn};