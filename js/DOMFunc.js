let naira = (1).toLocaleString('en-NG', {style:'currency', currency:"NGN"})[0];
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let years = [2018, 2019, 2020, 2021],
    yearDrop = "<option value=''>CHOOSE YEAR</option>",
    monthDrop = "<option value=''>CHOOSE MONTH</option>",
    currDate = new Date(),
    currYear = currDate.getFullYear(), currMonth = currDate.getMonth(),
    yearSelect = document.querySelector('#chooseYear');

months.forEach(mon => monthDrop += `<option value='${months.indexOf(mon)}'>${mon}</option>`);
years.forEach(yr => yearDrop += `<option value='${yr}'>${yr}</option>`);




/******* FUNCTION TO CREATE SCHOOLS TABLE******** */
function schoolsTable(res){
    let snum = 1;
    let schoolTable = `<table class='table table-bordered table-striped table-sm' >
        <thead class='oxblood'>
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
    let snum = 1,
        staffSalary = res.salary.reduce((acc, sch) => {
            return {
                ...acc, 
                [sch.school_id]: (+sch.salary).toLocaleString('en-NG', {style:'currency', currency:'NGN'})
            }
        }, {}),
        pay_stats = res.pay_stats ? res.pay_stats.reduce((acc, sch) => {
            return {...acc, [sch.school_id]: {pay_date: sch.pay_date, pay_id: sch.id}}
        }, {}) : [],
        totalSalary = res.salary.reduce((acc, sch) => acc += +sch.salary, 0);

    let schoolTable = `
        <div class='row oxblood pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12'>
                <h4 class='text-center'>
                Total Salary Payable: ${totalSalary.toLocaleString('en-NG', {style:'currency', currency:'NGN'})}
                </h4>
            </div>
            <div class='col-12 pt-1 border-top border-light'>
                <h5>Month: 
                    <span id='currMonth' data-val='${res.searchDate.m}'>${months[+res.searchDate.m]}</span>, 
                    <span id='currYear'data-val='${res.searchDate.y}'>${res.searchDate.y}</span>
                </h5>
            </div>
        </div>
        <div class='d-flex justify-content-center  flex-wrap'>
            <div class='d-flex oxblood rounded p-2 align-items-center justify-content-center' style='width:50%;'>            
                <div class='' style='width:50%;'><select id='chooseMonth' style='width:100% !important;'>${monthDrop}</select></div>
                <div class='' style='width:50%;'><select id='chooseYear' style='width:100% !important;'>${yearDrop}</select></div>
            </div>
            <div class='pt-1 text-center' style='width:100%'><button class='btn btn-outline oxline' data-page='payroll' id='changeMonth'>SELECT</button></div>
        </div>
        <table class='table table-bordered table-striped table-sm mt-2' >
        <thead class='oxblood text-center'>
            <th>S/No.</th>
            <th>Name</th>
            <th>Staff Size</th>
            <th>Total Salary per Month</th>
            <th>Approval Status</th>
            <th>Bank Payment Report</th>
            <th>Process Payroll</th>
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
            <td class='text-center'>${pay_stats[sch.school_id] ? 'Approved' :'Unprocessed'}</td>
            <td class='text-center'>Not Paid</td>
            <td class='text-center'>
                ${pay_stats[sch.school_id] ?
                `<button class='btn btn-outline-success btn-sm schoolReportBtn' data-val='${pay_stats[sch.school_id].pay_id}'  data-sch='${sch.school_id}'>
                    Report
                </button>` :
                `<button class='btn btn-outline-primary btn-sm schoolPayrollBtn'  data-sch='${sch.school_id}'>
                    Process
                </button>`
                }
            </td>
        </tr>
        `
    );
    schoolTable += '</tbody></table>'

    return schoolTable;
}

/******* FUNCTION TO CREATE STAFF TABLE******** */
function staffTableFxn(res){
    let snum = 1;
    let staffTable = `
    <h4>${res.sch[0].school_name}</h4>
    <table class='table table-bordered table-striped' >
        <thead class='oxblood'>
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
                data-st='${st.StaffID}' data-record='${JSON.stringify(st)}'>
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
                    <span class='input-group-text bg-secondary'>${field.field_name}</span>
                </div>
                <input type='number' id='gen_${field.field_slug}_val' data-field='${field.field_slug}'>
            </div>
        `
    })
    let staffTable = `        
        <div class='row oxblood pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12 col-md-4 pb-2'> Date: <input type=date id='payroll_date' value='${res.date.y}/0${res.date.m}/28'> </div>
            <div class='col-12 pt-1 border-top border-light'>
                <h3 id='sch_name' class='text-center'>${res.school[0].school_name}</h3>
                <input type='hidden' id='school_id' value='${res.school[0].school_id}' >
            </div>
        </div>
        <div class='row'>
            <button class='btn oxblood' id='generalValues'>APPLY GENERAL VALUES</button>
        </div>
        <table class='table table-bordered table-striped table-sm table-responsive mt-2' >
        <thead class='oxblood text-white text-center'>
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
        <button class='mt-4 mb-4 btn btn-block oxblood' id='submitPayroll'> SUBMIT PAYROLL </button>`

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
        <thead class='oxblood'>
            <th>S/No.</th>
            <th>Grade Level</th>
            <th>Salary (${naira})</th>
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
        <h2 class='text-center m-2'>${res.name}</h2>
        <div class='row oxblood text-center rounded'>
            <div class='col-md-12'> <h4>PAYROLL APPROVED</h4> </div>
            <div class='col-md-2'></div>
            <div class='col-md-6'><h5>Total Salary to be Paid:</h5></div>
            <div class='col-md-4 text-left'>
                <h5>${res.date.total_salary.toLocaleString('en-NG', {style: 'currency', currency:'NGN'})}</h5>
            </div>
        </div>
        <input type='hidden' value='${res.date.pay_date}' id='dateVal'>
        <div class='row mt-4'>
            <div class='col-md-12 text-center'> <button class='btn oxline' id='continuePay'>
                Continue Payroll</button> 
            </div>
        </div>
    `;
}

const genReportsTableFxn = res => {
    let repRows = '';
    let num = 1;
    res.report.forEach(sch => repRows += `
        <tr>
            <td>${num++}</td>
            <td>${sch.school_name}</td>
            <td>${sch.pay_date}</td>
            <td>${(+sch.salary).toLocaleString('en-NG', {style:'currency', currency:'NGN'})}</td>
            <td>
                ${(+sch.total_salary_paid).toLocaleString('en-NG', {style:'currency', currency:'NGN'})}
            </td>
            <td>
                <button class='btn btn-outline oxline schoolReportBtn'data-val='${sch.id}' data-sch='${sch.school_id}'>VIEW</button>
            </td>
        </tr>

    `)

    let reportsTable = `
        <div class='row oxblood pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12'>
                <h4 class='text-center'>
                Total Salary Payable: 
                ${(+res.total[0].total_salary).toLocaleString('en-NG', {style:'currency', currency:'NGN'})}
                </h4>
            </div>
            <div class='col-12 pt-1 border-top border-light'>
                <h5>Month: 
                    <span id='currMonth' data-val='${res.searchDate.m}'>${months[+res.searchDate.m]}</span>, 
                    <span id='currYear' data-val='${res.searchDate.y}'>${res.searchDate.y}</span>
                </h5>
            </div>
        </div>
        <div class='d-flex justify-content-center  flex-wrap'>
            <div class='d-flex oxblood rounded p-2 align-items-center justify-content-center' style='width:50%;'>            
                <div class='' style='width:50%;'><select id='chooseMonth' style='width:100% !important;'>${monthDrop}</select></div>
                <div class='' style='width:50%;'><select id='chooseYear' style='width:100% !important;'>${yearDrop}</select></div>
            </div>
            <div class='pt-1 text-center' style='width:100%'><button class='btn btn-outline oxline' data-page='report' id='changeMonth'>SELECT</button></div>
        </div>
        <table class='table table-bordered table-striped' >
            <thead class='oxblood'>
                <th>S/No.</th>
                <th>School</th>
                <th>Date Approved</th>
                <th>Total Salary Payable</th>
                <th>Total Salary Approved</th>
                <th>School Report</th>
            <thead>
            <tbody>
                ${repRows}
            </tbody>
        </table>
    `
    
    return reportsTable;
}

/******* FUNCTION TO CREATE STAFF SALARY REPORT TABLE******** */
function schReportsTableFxn(res){
    let snum = 1;
    let pay_heads = '';

    res.fields.forEach(field => {
        pay_heads += `<th>${(field.field_name).toUpperCase()}</th>`;
    })
    let staffTable = `        
        <div class='row oxblood pt-2 pb-2 mb-2 text-white rounded'>
            <div class='col-12 pt-1  border-bottom border-light'>
                <h3 id='sch_name' class='text-center'>${res.school[0].school_name}</h3>
                <input type='hidden' id='school_id' value='${res.school[0].school_id}' >
            </div>
            <div class='col-12 col-md-4 py-1'> 
                <h5>Date: ${(months[res.date.m])}, ${res.date.y}</h5> 
            </div>
        </div>
        <table class='table table-bordered table-striped table-responsive table-sm mt-3' >
        <thead class='oxblood text-white text-center'>
            <th>S/No.</th>
            <th>Name</th>
            <th>SALARY<br>(${naira})</th>
            ${pay_heads}
            <th>NET PAY<br>(${naira})</th>
        <thead>
        <tbody>
    `;
    res.report.forEach(st => {
        let pay_fields = '';
        res.fields.forEach(field => pay_fields += `<td>${st[field.field_slug]}</td>`);
        staffTable += `
        <tr id='${st.StaffID}'>
            <td>${snum++}</td>
            <td>${st.Lastname+' '+st.Firstname+' '+st.Other_names}</td>            
            <td class='gradeSalary' data-pay='${st.grade_salary}'>
                ${(+st.grade_salary).toLocaleString('en-NG')}
            </td>
            ${pay_fields}
            <td class='netSalary'>${st.net_pay}</td>
        </tr>
        `
    });
    staffTable += `
        </tbody>
        </table>`

    return staffTable;
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
    genReportsTableFxn,
    schReportsTableFxn,
};