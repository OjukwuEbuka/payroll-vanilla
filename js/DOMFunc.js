let naira = (1).toLocaleString('en-NG', {style:'currency', currency:"NGN"})[0];

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
    let staffSalary = res.salary.reduce((acc, sch) => {
        return {
            ...acc, 
            [sch.school_id]: (+sch.salary).toLocaleString('en-NG', {style:'currency', currency:'NGN'})
        }
    }, {});
    let totalSalary = res.salary.reduce((acc, sch) => acc += +sch.salary, 0);
    let schoolTable = `
        <div class='row bg-secondary bg-secondary pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12 pt-1 border-top border-light'>
                <h3 class='text-center'>
                Total Salary Payable: ${totalSalary.toLocaleString('en-NG', {style:'currency', currency:'NGN'})}
                </h3>
            </div>
        </div>
        <table class='table table-bordered table-striped table-sm' >
        <thead class='text-white bg-secondary'>
            <th>S/No.</th>
            <th>Name</th>
            <th>Staff Size</th>
            <th>Total Salary</th>
            <th>View Payroll</th>
        <thead>
        <tbody>
    `;
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
    let generalInput = '';

    res.fields.forEach(field => {
        pay_heads += `<th>${field.field_name}</th>`;
        pay_fields += `<td><input type='number' class='payinp ${field.field_slug}'
        data-field='${field.field_slug}' 
        data-action='${field.field_action}'></td>`
        generalInput += `
            <div class='input-group mb-3'>
                <div class='input-group-prepend'>
                    <span class='input-group-text'>${field.field_name}</span>
                </div>
                <input type='number' id='gen_${field.field_slug}_val' data-field='${field.field_slug}'>
            </div>
        `
    })
    let staffTable = `        
        <div class='row bg-secondary pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12 col-md-4 pb-2'> Date: <input type=date id='payroll_date'> </div>
            <div class='col-12 pt-1 border-top border-light'>
                <h3 id='sch_name' class='text-center'>${res.school[0].school_name}</h3>
                <input type='hidden' id='school_id' value='${res.school[0].school_id}' >
            </div>
        </div>
        <div class='row'>
            <button class='btn btn-secondary' id='generalValues'>APPLY GENERAL VALUES</button>
        </div>
        <table class='table table-bordered table-striped table-sm table-responsive mt-2' >
        <thead class='bg-secondary text-white text-center'>
            <th>S/No.</th>
            <th>Name</th>
            <th>Salary<br>(${naira})</th>
            ${pay_heads}
            <th>Net Pay<br>(${naira})</th>
        <thead>
        <tbody>
    `;
    res.staff.forEach(st => staffTable += `
        <tr id='${st.StaffID}'>
            <td>${snum++}</td>
            <td>${st.Lastname+' '+st.Firstname+' '+st.Other_names}</td>            
            <td class='gradeSalary' data-pay='${st.grade_salary}'>
                ${(+st.grade_salary).toLocaleString('en-NG')}
            </td>
            ${pay_fields}
            <td class='netSalary'>${st.grade_salary}</td>
        </tr>
        `
    );
    staffTable += `
        </tbody>
        </table>
        <button class='mt-4 mb-4 btn btn-block btn-secondary' id='submitPayroll'> SUBMIT PAYROLL </button>`

    document.querySelector('#payrollModal #payrollModalLabel').textContent = 'APPLY GENERAL VALUES';
    document.querySelector('#payrollModal .modal-body').innerHTML = generalInput;
    document.querySelector('#payrollModal .modal-footer').innerHTML = `
    <button type="button" class="btn btn-success" id='apply_gen_values' data-dismiss='modal'>Apply</button>`;


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

/************** */
const submittedDetailsFxn = res =>{
    return `
        <h2 class='text-center m-2'>${res.school_id}</h2>
        <div class='row bg-secondary text-white text-center rounded'>
            <div class='col-md-12'> <h4>SALARIES PAID SUCCESSFULLY</h4> </div>
            <div class='col-md-2'></div>
            <div class='col-md-6'>Total Salary Paid:</div>
            <div class='col-md-4'>
                ${res.total_salary.toLocaleString('en-NG', {style: 'currency', currency:'NGN'})}
            </div>
        </div>
        <div class='row mt-4'>
            <div class='col-md-12 text-center'> <button class='btn btn-outline-secondary' id='continuePay'>
                Continue Payroll</button> 
            </div>
        </div>
    `;

}


function number_format(number, decimals, dec_point, thousands_sep){
    let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        toFixedFix = (n, prec) => {
            let k = Math.pow(10, prec);
            return Math.round(n * k ) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if(s[0].length > 3){
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if((s[1] || '').length < prec){
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

export {
    schoolsTable, 
    staffTableFxn, 
    schoolsSalaryTable, 
    staffSalaryTableFxn, 
    gradeLevelTableFxn,
    submittedDetailsFxn,
};