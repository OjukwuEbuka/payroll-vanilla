import {homeContent} from './mainContent.js';
import * as page from './DOMFunc.js';
import {
    schoolCallBack, 
    staffCallBack, 
    schoolPayrollCallBack,
    schoolListSalaryCallBack,
    handleDOMAJAXRes,
    viewStaffBtnInit,
    gradeLevelCallBack
} from './AJAXCallbacks.js';

/********Load data into index page******** */
document.addEventListener('DOMContentLoaded', e => {
    document.querySelector('main').innerHTML = homeContent;
    history.pushState({content: homeContent, title:'Dashboard'}, 'Dashboard', '');
})


/************List of Link Controls  Variables************ */
const viewSchool = document.querySelector('#viewSchoolStaff');
const payStaffSalary = document.querySelector('#payStaffSalary');
const payBySchool = document.querySelector('#payBySchool');
const generalReports = document.querySelector('#generalReports');
const schoolReports = document.querySelector('#schoolReports');
const monthlyReports = document.querySelector('#monthlyReports');
const gradeLevelPay = document.querySelector('#gradeLevelPay');
const additionDeduction = document.querySelector('#additionDeduction');


/***********Browser History Controls********** */
window.onpopstate = e => {
    const data = e.state;
    document.title = data.title;
    document.querySelector('main').innerHTML = data.content;
    if(data.resPage == 'viewSchool') viewStaffBtnInit();
}


/************Link Navigation Action************* */
viewSchool.addEventListener('click', viewSchoolFxn)
payStaffSalary.addEventListener('click', payStaffSalaryFxn)
payBySchool.addEventListener('click', payBySchoolFxn)
generalReports.addEventListener('click', generalReportsFxn)
schoolReports.addEventListener('click', schoolReportsFxn)
monthlyReports.addEventListener('click', monthlyReportsFxn)
gradeLevelPay.addEventListener('click', gradeLevelPayFxn)
// additionDeduction.addEventListener('click', additionDeductionFxn)




/*************List of Link Control Functions************* */

/*************Function to View School Staff************* */
function viewSchoolFxn(e){
    e.preventDefault();
    const title = 'View Staff';
    document.title = title;
    handleDOMAJAXRes('queryPage.php', title, {fetch: 'schools'}, schoolCallBack, 'viewSchool');
}



/*********FXN to fetch Staff for each School********* */
const staffProfileBtnInit = () => {
    let staffProfileBtn = document.querySelectorAll('.staffProfileBtn');
    // staffProfileBtn.forEach(btn => {
    //     btn.addEventListener('click', e => {
    //         e.preventDefault();
    //         const title = 'View Staff';
    //         document.title = title;
    //         handleDOMAJAXRes('queryPage.php', title, {fetch: 'staff', school: btn.dataset.sch}, staffCallBack, 'viewStaff');
    //     })
    // })
}


/*************Function to Pay Staff Salary************* */
function payStaffSalaryFxn(e){
    e.preventDefault();
    const title = 'View Staff';
    document.title = title;
    handleDOMAJAXRes('queryPage.php', title, {fetch: 'schools_salary'}, schoolListSalaryCallBack, 'viewSchool');
}


/*************Function to Pay Salary by School************* */
function payBySchoolFxn(e){
    e.preventDefault();
    const title = 'Pay School';
    const content = `<h3>Pay by School</h3>`;
    document.querySelector('main').innerHTML = content;
    document.title = title;
    history.pushState({content, title}, 'Pay School');
}

/*************Function to View General Reports************* */
function generalReportsFxn(e){
    e.preventDefault();
    const title = 'General Reports';
    const content = `<h3>General Reports</h3>`;
    document.querySelector('main').innerHTML = content;
    document.title = title;
    history.pushState({content, title}, 'General Reports');
}

/*************Function to View School Payroll Reports************* */
function schoolReportsFxn(e){
    e.preventDefault();
    const title = 'School Reports';
    const content = `<h3>School Reports</h3>`;
    document.querySelector('main').innerHTML = content;
    document.title = title;
    history.pushState({content, title}, 'School Reports');
}

/*************Function to View Monthly Payroll Reports************* */
function monthlyReportsFxn(e){
    e.preventDefault();
    const title = 'Monthly Reports';
    const content = `<h3>Monthly Reports</h3>`;
    document.querySelector('main').innerHTML = content;
    document.title = title;
    history.pushState({content, title}, 'Monthly Reports');
}


/*************Function to View Salary By Grade Level************* */
function gradeLevelPayFxn(e){
    e.preventDefault();
    const title = 'Grade Level';
    const content = `<h3>Grade Level</h3>`;
    document.querySelector('main').innerHTML = content;
    document.title = title;
    history.pushState({content, title}, 'Grade Level');
    handleDOMAJAXRes('queryPage.php', title, {fetch: 'grade_level'}, gradeLevelCallBack, 'gradeLevel');
}


// function AJAX(method, url, Fxn, OBJ={}){

//     let feedback = null;
//     let xhr = new XMLHttpRequest();
//     xhr.responseType = 'json';
//     xhr.open(method, url);
//     xhr.onload = () => {
//         const res = xhr.response;
//         feedback = Fxn(res);
//     }

//     if(method == 'POST'){
//         xhr.setRequestHeader("Content-type", 'application/json');
//         xhr.send(JSON.stringify(OBJ));
//     } else {
//         xhr.send();
//     }
//     return feedback;
// }
