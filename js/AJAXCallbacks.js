import * as page from './DOMFunc.js';



/**********AJAX CALLBACK FUNCTION FOR VIEW ALL SCHOOLS********** */
function schoolCallBack(res){
    let pageContent = `
        <h2 class='pb-3 text-center'>ARCHDIOCESAN SCHOOLS LIST</h2>
        ${page.schoolsTable(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;    
    viewStaffBtnInit();
    return pageContent;
}


/**********AJAX CALLBACK FUNCTION FOR VIEW SCHOOL STAFF********** */
function staffCallBack(res){
    let pageContent = `
        <h2 class='pb-3 text-center'>STAFF LIST</h2>
        ${page.staffTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    // staffProfileBtnInit();
    return pageContent;
}


/*********CALLBACK FUNCTION TO LIST SCHOOLS WITH TOTAL SALARY ******** */
function schoolListSalaryCallBack(res){
    let pageContent = `
        <h2 class='pb-3 text-center'>STAFF LIST</h2>
        ${page.schoolsSalaryTable(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    schoolPayrollBtnInit();
    return pageContent;
}


/**********CALLBACK FXN TO LOAD SCHOOL PAYROLL PAGE ********* */
const schoolPayrollCallBack = res => {
    console.log(res);
    let pageContent = `
        <h2 class='pb-3 text-center'>STAFF PAYROLL TABLE</h2>
        ${page.staffSalaryTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    payrollCalc();
    generalBonusFxn();
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
const generalBonusFxn = () => {
    let generalBonusBtn = document.querySelector('#generalBonus');
    generalBonusBtn.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('#payrollModal #payrollModalLabel').textContent = 'APPLY GENERAL BONUS';
        document.querySelector('#payrollModal .modal-body').innerHTML = `
            <div class='input-group mb-3'>
                <div class='input-group-prepend'>
                    <span class='input-group-text'>BONUS</span>
                </div>
                <input type='number' id='gen-bonus-val' >
            </div>
        `
        document.querySelector('#payrollModal .modal-footer').innerHTML = `
      <button type="button" class="btn btn-success" id='applyBonus'>Apply</button>`
        $('#payrollModal').modal('show');
        document.querySelector('#payrollModal #applyBonus').addEventListener('click', e => {
            e.preventDefault();
            let genBonusVal = +document.querySelector('#gen-bonus-val').value;
            document.querySelectorAll('.bonus').forEach(bon => bon.value = +bon.value + genBonusVal);
            document.querySelectorAll('table tbody tr').forEach(trow => eventAct(trow));
        })
    })
    }


/**********CALLBACK FXN TO LOAD GRADE LEVEL TABLE PAGE ********* */
const gradeLevelCallBack = res => {
    console.log(res);
    let pageContent = `
        <h2 class='pb-3 text-center'>STAFF GRADE LEVEL</h2>
        ${page.gradeLevelTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    // schoolPayrollBtnInit();
    return pageContent;
}


/********Async Fetch API ******* */
function AJAX(method, url, OBJ={}){
    let headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    let request = new Request(url, {method, headers, body: JSON.stringify(OBJ)});
    return fetch(request);
}

/*********FXN to handle AJAX call and modify the DOM********** */
function handleDOMAJAXRes(url, title, fetchObj, callbkf, resPage){
    try {
        (async () => {
            let resJson = await AJAX('POST', url, fetchObj); 
            let res = await (resJson => resJson.ok ? resJson.json() : Error(resJson.statusText))(resJson);
            // if(typeof res != Object) throw res;
            document.querySelector('main').innerHTML = `<div class='spinner-border' role='status'> 
            <span class='sr-only'>Loading...<span></div>`;
            console.log(res);
            let content = callbkf(res);
            history.pushState({content, title, resPage}, title);
        })()
    } catch (error) {
        console.log(error)
    }
}



/*********FXN to fetch Staff for each School********* */
const schoolPayrollBtnInit = () => {
    let schoolPayrollBtn = document.querySelectorAll('.schoolPayrollBtn');
    schoolPayrollBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const title = 'School Payroll';
            document.title = title;
            handleDOMAJAXRes('queryPage.php', title, {fetch: 'school_payroll', school: btn.dataset.sch}, schoolPayrollCallBack, 'viewStaff');
        })
    })
}


/*********FXN to fetch Staff for each School********* */
const viewStaffBtnInit = () => {
    let viewStaffBtn = document.querySelectorAll('.viewStaffBtn');
    viewStaffBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const title = 'View Staff';
            document.title = title;
            handleDOMAJAXRes('queryPage.php', title, {fetch: 'staff', school: btn.dataset.sch}, staffCallBack, 'viewStaff');
        })
    })
}





export {
    schoolCallBack, 
    staffCallBack, 
    schoolPayrollCallBack, 
    schoolListSalaryCallBack,
    handleDOMAJAXRes,
    AJAX,
    viewStaffBtnInit,
    gradeLevelCallBack,
}