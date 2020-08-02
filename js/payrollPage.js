import {staffSalaryTableFxn} from './DOMFunc.js';



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
    let gradeValue = +trow.querySelector('.gradeSalary').textContent;
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
    netSal.textContent = gradeValue < 0 ? 'Error' :gradeValue.toFixed(2);
};

/********FXN TO ACTIVATE GENERAL BONUS MODAL******** */
const generalValuesFxn = () => {
    let generalValuesBtn = document.querySelector('#generalValues');
    let oldGen = document.querySelectorAll('.modal-body input');
    let oldGenVals = {};
    generalValuesBtn.addEventListener('click', e => {
        e.preventDefault();        
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
    let payPackObj = {};
    let school_id = document.querySelector('#school_id').value;
    let payRows = document.querySelectorAll('table tbody tr');
    payRows.forEach(trow => {
        let rowFields = trow.querySelectorAll('input');
        let rowObj = {};
        rowFields.forEach(field => rowObj[field.dataset.field] = field.value);
        payPackObj[trow.getAttribute('id')] = {
            ...rowObj,
            school_id,
            netSalary: trow.querySelector('.netSalary').textContent
        }
    });
    console.log(payPackObj);
}


export {schoolPayrollCallBack}