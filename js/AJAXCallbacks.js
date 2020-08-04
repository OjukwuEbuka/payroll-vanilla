import * as page from './DOMFunc.js';
import {schoolPayrollCallBack} from './payrollPage.js';
import {createPayrollFxn, generalReportsFxn} from './main.js';

let loadSpinner = `
    <div class='spinnerDiv'>
        <div class='spinner-border' role='status'> 
            <span class='sr-only'>Loading...<span>
        </div>
    </div>`;



/**********AJAX CALLBACK FUNCTION FOR VIEW ALL SCHOOLS********** */
function schoolCallBack(res){
    let pageContent = `
        <h3 class='pb-3 text-center'>ARCHDIOCESAN SCHOOLS LIST</h3>
        ${page.schoolsTable(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;    
    viewStaffBtnInit();
    return pageContent;
}


/**********AJAX CALLBACK FUNCTION FOR VIEW SCHOOL STAFF********** */
function staffCallBack(res){
    let pageContent = `
        <h3 class='pb-3 text-center'>STAFF LIST</h3>
        ${page.staffTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    staffProfileBtnInit();
    return pageContent;
}

/*********FXN to view Staff Profile********* */
const staffProfileBtnInit = () => {
    let staffProfileBtn = document.querySelectorAll('.staffProfileBtn');
    staffProfileBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            let stModal = document.querySelector('#payrollModal'),
                stBody = '',
                staff = JSON.parse(btn.dataset.record);
            stModal.querySelector('#payrollModalLabel').textContent = 'STAFF PROFILE';
            for (const [key, val] of Object.entries(staff)) {
                console.log(key,val)
                if(key=='Staff_qualifications' || key=='appraisal' || key=='children'){
                    stBody += `<div class="column-wrapper col-md-12 border-top border-dark">
                            <label for="" class="column-header">${key}</label>
                            <div class="column-value">${val}</div>
                        </div>`
                } else {
                    stBody += `<div class="column-wrapper col-sm-12 col-md-6 border-top border-dark">
                            <label for="" class="column-header">${key}</label>
                            <div class="column-value">${val}</div>
                        </div>`
                }
            }
            stModal.querySelector('.modal-body').innerHTML = stBody;
            stModal.querySelector('.modal-dialog').classList.add('wider');
            stModal.querySelector('.modal-body').classList.add('row');
            $('#payrollModal').modal('show');
            // const title = 'View Staff';
            // document.title = title;
            // document.querySelector('main').innerHTML = loadSpinner;
            // handleDOMAJAXRes('queryPage.php', title, {fetch: 'staff', school: btn.dataset.sch}, staffCallBack, 'viewStaff');
        })
    })
}

/********Change Month********* */
const monthSelectFxn = () => {
    let monthBtn = document.querySelector('#changeMonth');
    monthBtn.addEventListener('click', e=>{
        e.preventDefault();
        let m = +document.querySelector('#chooseMonth').value,
            y = document.querySelector('#chooseYear').value;
        if(monthBtn.dataset.page=='payroll') createPayrollFxn(e, {m, y})
        if(monthBtn.dataset.page=='report') generalReportsFxn(e, {m, y})
    })
}

/*********CALLBACK FUNCTION TO LIST SCHOOLS WITH TOTAL SALARY ******** */
function schoolListSalaryCallBack(res){
    let pageContent = `
        <h3 class='pb-3 text-center'>SCHOOL PAYROLL LIST</h3>
        ${page.schoolsSalaryTable(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    schoolPayrollBtnInit();
    monthSelectFxn();
    schoolReportBtnInit();
    return pageContent;
}


/**********CALLBACK FXN TO LOAD GRADE LEVEL TABLE PAGE ********* */
const gradeLevelCallBack = res => {
    console.log(res);
    let pageContent = `
        <h3 class='pb-3 text-center'>STAFF GRADE LEVEL</h3>
        ${page.gradeLevelTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
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
            // console.log(res);
            let content = callbkf(res);
            history.pushState({content, title, resPage}, title);
        })()
    } catch (error) {
        console.log(error)
    }
}

/*********Handle Simpler AJAX****** */
function handleAJAX(url, fetchObj, callbkf){
    try {
        (async () => {
            let resJson = await AJAX('POST', url, fetchObj); 
            let res = await (resJson => resJson.ok ? resJson.json() : Error(resJson.statusText))(resJson);
            callbkf(res);
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
            let m = document.querySelector('#currMonth').dataset.val,
                y = document.querySelector('#currYear').dataset.val
            document.querySelector('main').innerHTML = loadSpinner;
            handleDOMAJAXRes('queryPage.php', title, 
                {fetch: 'school_payroll', school: btn.dataset.sch, date:{m,y}}, 
                schoolPayrollCallBack, 'viewStaff');
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
            document.querySelector('main').innerHTML = loadSpinner;
            handleDOMAJAXRes('queryPage.php', title, {fetch: 'staff', school: btn.dataset.sch}, staffCallBack, 'viewStaff');
        })
    })
}

/*******FXN Callback for General Schools Report****** */
const schoolsReportCallback =  res => {
    console.log(res);
    let pageContent = `
        <h3 class='pb-3 text-center'>GENERAL REPORTS</h3>
        ${page.genReportsTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    schoolReportBtnInit();
    monthSelectFxn();
    return pageContent;
}

/*******FXN to fetch individual school payroll report****** */
const schoolReportBtnInit = () => {
    let reportBtn = document.querySelectorAll('.schoolReportBtn');
    reportBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const title = 'Payroll Report';
            document.title = title;
            let m = document.querySelector('#currMonth').dataset.val,
                y = document.querySelector('#currYear').dataset.val
            document.querySelector('main').innerHTML = loadSpinner;
            handleDOMAJAXRes('queryPage.php', title, 
                {fetch: 'payroll_report', school: btn.dataset.sch, payroll: btn.dataset.val, date:{m,y}}, 
                payrollReportCallBack, 'payrollReport');})
    })
}

/*******FXN Callback for General Schools Report****** */
const payrollReportCallBack =  res => {
    console.log(res);
    let pageContent = `
        <h3 class='pb-3 text-center'>SCHOOL PAYROLL REPORT</h3>
        ${page.schReportsTableFxn(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    // schoolReportBtnInit();
    return pageContent;
}


export {
    schoolCallBack, 
    staffCallBack,  
    schoolListSalaryCallBack,
    handleDOMAJAXRes,
    AJAX,
    viewStaffBtnInit,
    gradeLevelCallBack,
    loadSpinner,
    schoolPayrollBtnInit,
    schoolReportBtnInit,
    monthSelectFxn,
    handleAJAX,
    schoolsReportCallback,
}