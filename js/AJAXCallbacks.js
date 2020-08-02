import * as page from './DOMFunc.js';
import {schoolPayrollCallBack} from './payrollPage.js';

let loadSpinner = `
    <div class='spinnerDiv'>
        <div class='spinner-border' role='status'> 
            <span class='sr-only'>Loading...<span>
        </div>
    </div>`;



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
        <h2 class='pb-3 text-center'>SCHOOL PAYROLL LIST</h2>
        ${page.schoolsSalaryTable(res)}
    `;
    document.querySelector('main').innerHTML = pageContent;
    schoolPayrollBtnInit();
    return pageContent;
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
            // console.log(res);
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
            document.querySelector('main').innerHTML = loadSpinner;
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
            document.querySelector('main').innerHTML = loadSpinner;
            handleDOMAJAXRes('queryPage.php', title, {fetch: 'staff', school: btn.dataset.sch}, staffCallBack, 'viewStaff');
        })
    })
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
}