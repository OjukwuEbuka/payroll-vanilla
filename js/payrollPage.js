import {staffSalaryTableFxn, submittedDetailsFxn} from './DOMFunc.js';
import {handleDOMAJAXRes, loadSpinner, handleAJAX, schoolReportBtnInit} from './AJAXCallbacks.js';
import {createPayrollFxn} from './main.js';



/**********CALLBACK FXN TO LOAD SCHOOL PAYROLL PAGE ********* */
const schoolPayrollCallBack = res => {
    console.log(res);
    let pageContent = `
        <h2 class='pb-3 text-center'>STAFF PAYROLL TABLE</h2>
        ${staffSalaryTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    payrollCalc();
    generalValuesFxn();
    document.querySelector('#submitPayroll').addEventListener('click', e => {
        e.preventDefault();
        packPayroll();
    })
    // schoolPayrollBtnInit();
    return pageContent;
}

/********FXN TO ASSIGN CALC FXN TO INPUT EVENTS****** */
const payrollCalc = () => {
    let payRows = document.querySelectorAll('table tbody tr');
    payRows.forEach(trow => {
        let payrollInputs = trow.querySelectorAll('.payinp');
        payrollInputs.forEach(inp => {
            inp.addEventListener('keyup', e => {e.preventDefault(); eventAct(trow)});
            inp.addEventListener('input', e => {e.preventDefault(); eventAct(trow)});
        })
    })
}

/*******FXN TO CALCULATE NET SALARY FROM INPUT FIELDS****** */
let eventAct = trow =>{
    let gradeValue = +trow.querySelector('.gradeSalary').dataset.pay;
        let netSal = trow.querySelector('.netSalary');
        trow.querySelectorAll('.payinp').forEach(inpCalc => {
        let inpVal = +inpCalc.value;
        let inpAction = inpCalc.dataset.action;
        if(inpAction == 'add'){
            gradeValue += inpVal;
        } else if (inpAction == 'deduct') {
            gradeValue -= inpVal;
        }
    })
    netSal.textContent = gradeValue < 0 ? 'Error' : gradeValue.toFixed(2);
};

/********FXN TO ACTIVATE GENERAL BONUS MODAL******** */
const generalValuesFxn = () => {
    let generalValuesBtn = document.querySelector('#generalValues');
    let oldGen = document.querySelectorAll('.modal-body input');
    let oldGenVals = {};
    generalValuesBtn.addEventListener('click', e => {
        e.preventDefault();        
        smallerModal();
        $('#payrollModal').modal('show');
        oldGen.forEach(val => oldGenVals[val.dataset.field] = isNaN(+val.value) ? 0 : +val.value );
    })
    document.querySelector('#payrollModal #apply_gen_values')
        .addEventListener('click', e => {
        e.preventDefault();
        let genVals = document.querySelectorAll('.modal-body input');
        genVals.forEach(val => {
            let val_slug = val.dataset.field;
            let val_val = +val.value;
            document.querySelectorAll(`.${val_slug}`).forEach(indi => indi.value = +indi.value + val_val - oldGenVals[val_slug]);

        })
        document.querySelectorAll('table tbody tr').forEach(trow => eventAct(trow));
    })
}

/********FXN TO PACK PAYROLL VALUES******** */
const packPayroll = () => {
    let payPackObj = {},
        total_salary = 0,
        school_id = document.querySelector('#school_id').value,
        pay_date = document.querySelector('#payroll_date').value;
    if (!checkDate(pay_date)) return false;

    /*********** CHECK PAYROLL EXISTS  *********** */
    handleAJAX('queryPage.php', {fetch: 'check_payroll', 
        data:{school_id, payDate: pay_date}}, checkPayrollExists)
        
    let payRows = document.querySelectorAll('table tbody tr');
    payRows.forEach(trow => {
        let rowFields = trow.querySelectorAll('input'),
            net_salary = trow.querySelector('.netSalary').textContent,
            rowObj = {},
            grade_salary = trow.querySelector('.gradeSalary').dataset.pay;
        total_salary += +net_salary;
        rowFields.forEach(field => rowObj[field.dataset.field] = field.value);
        payPackObj[trow.getAttribute('id')] = {
            ...rowObj,
            school_id,
            net_salary,
            grade_salary
        }
    });
    submitModal(total_salary);
    let payDateObj = {school_id, pay_date, total_salary};
    document.querySelector('#sendPayrollBtn').addEventListener('click', e =>{
        e.preventDefault();
        document.querySelector('main').innerHTML = loadSpinner;
        handleDOMAJAXRes('queryPage.php', 
            'Payroll Submitted', 
            {fetch: 'create_payroll', data: {payDateObj, payPackObj}}, 
            payrollSubmittedFxn, 'viewStaff');
        console.log(payDateObj, payPackObj);
    })
        
}

/**********Callback FXN to Check if Payroll exists********* */
function checkPayrollExists(res){
    if(res.check.length == 0){
        return;
    }else{
        let payDate = new Date(res.check[0].pay_date)
        document.querySelector('#payrollModal #payrollModalLabel').innerHTML = `
            PAYROLL ALREADY APPROVED FOR THIS SCHOOL!
        `;
    document.querySelector('#payrollModal .modal-body').innerHTML = '';
        document.querySelector('#payrollModal .modal-footer').innerHTML = `    
            <button type="button" class="btn btn-success schoolReportBtn" 
                id='' data-dismiss='modal' data-sch='${res.check[0].school_id}' data-val='${res.check[0].id}'>
                GO TO REPORT</button>
                <input type='hidden' id='currMonth' data-val='${payDate.getMonth()}' >
                <input type='hidden' id='currYear' data-val='${payDate.getFullYear()}' >
            <button type="button" class="btn btn-danger" id='' data-dismiss='modal'>Cancel</button>
        `
        smallerModal();
        $('#payrollModal').modal('show')
       schoolReportBtnInit();
    }
}

/*******Check selection of payroll date******* */
const checkDate = pay_date => {
    let datebox = document.querySelector('#payroll_date');
    if(pay_date == ''){
        alert('Please select a date.');
        datebox.classList.add('text-danger');
        datebox.addEventListener('change', ()=>{
            if(datebox.value != '') datebox.classList.remove('text-danger');
        })
        return false;
    }
    return true;
}


/**********Submit Payroll Modal******** */
const submitModal = total_salary => {    
    document.querySelector('#payrollModal #payrollModalLabel').innerHTML = `
        SUBMIT PAYROLL
        <h4>${document.querySelector('#sch_name').textContent}</h4>
    `;
    document.querySelector('#payrollModal .modal-body').innerHTML = `
        <div class='row'>
            <div class='col-8 text-center'><h5>Total Salary to be paid: </h5></div>
            <div class='col-4 text-center'><h5>${total_salary.toLocaleString('en-NG', {style:'currency', currency:'NGN'})} </h5></div>
        </div>
    `;
    document.querySelector('#payrollModal .modal-footer').innerHTML = `    
        <button type="button" class="btn btn-success" id='sendPayrollBtn' data-dismiss='modal'>Submit</button>
        <button type="button" class="btn btn-danger" id='cancelPayroll' data-dismiss='modal'>Cancel</button>
    `
    smallerModal();
    $('#payrollModal').modal('show')
}


/********CALLBACK FXN FOR SUBMITTED PAYROLL******* */
const payrollSubmittedFxn = res => {
    let pageContent = `
        ${submittedDetailsFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    // schoolPayrollBtnInit();
    let dateApp = new Date(document.querySelector('#dateVal').value),
        m = dateApp.getMonth(),
        y = dateApp.getFullYear();
    console.log(dateApp);
    document.querySelector('#continuePay').addEventListener('click', e =>createPayrollFxn(e, {m, y}))
    return pageContent;
}

function smallerModal(){
    document.querySelector('#payrollModal .modal-dialog').classList.remove('wider');
    document.querySelector('#payrollModal .modal-body').classList.remove('row');
}


export {schoolPayrollCallBack}