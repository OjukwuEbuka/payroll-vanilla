<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payroll</title>
    <style>
        .bg-border-radius {
            margin: -400px auto 0;
            width: 1000px;
            height: 800px;
            overflow: hidden;
            border-radius: 0 0 30% 70%;
            background-color: #0080C1;
        }

        li a:hover{
            text-decoration: none;
        }

        nav .collapse ul li {
            border-bottom: 0.05rem solid #ddd;
        }

        #sidebarMenu{
            height:100vh;
            position: fixed;
        }

        .spinnerDiv{
          width: 100%;
          height: 100vh;
          padding-left: 40%;
          display: flex;
          flex-direction: column;
          align-content: center;
          justify-content: center;
        }

        .spinner-border{
          width: 10rem !important;
          height: 10rem !important;
        }
        
        .payinp{
          max-width: 5rem;
          max-height: 1.5rem;
          border-radius: .4rem;
          border: none;
          background-color: #dfdfdf;
        }

        th{
          text-transform: Capitalize;
        }

        /* .headSelect{
          border-radius: .5rem;
        } */
    </style>
    <!-- CSS only -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

</head>
<body>
    <!-- <div class="bg-border-radius">
    
    </div> -->
<div class="container-fluid">
  <div class="row">
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link active" href="<?php echo $_SERVER['PHP_SELF']; ?>">
              <span data-feather="home"></span>
              Dashboard <span class="sr-only">(current)</span>
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#managepayroll" role="button" aria-expanded="false" aria-controls="managepayroll">
              <span data-feather="shopping-cart"></span>
              Manage Payroll
            </a>
            <div class="collapse" id="managepayroll">
                <ul class="" style="list-style-type:none;">
                    <li class="nav-item"><a href="#" id="createPayroll"> Create Payroll </a></li>
                    <li class="nav-item"><a href="#"> Link 1</a></li>
                </ul>                
            </div>
          </li>

          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#payrollreports" role="button" aria-expanded="false" aria-controls="payrollreports">
              <span data-feather="shopping-cart"></span>
              Payroll Reports
            </a>
            <div class="collapse" id="payrollreports">
                <ul class="" style="list-style-type:none;">
                    <li class="nav-item"><a href="#" id="generalReports"> General Reports</a></li>
                    <li class="nav-item"><a href="#" id="schoolReports"> School Reports</a></li>
                    <li class="nav-item"><a href="#" id="monthlyReports"> Monthly Reports</a></li>
                </ul>                
            </div>
          </li>
          
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#managestaff" role="button" aria-expanded="false" aria-controls="managestaff">
              <span data-feather="users"></span>
              Manage Staff
            </a>
            <div class="collapse" id="managestaff">
                <ul class="" style="list-style-type:none;">
                    <li class="nav-item"><a href="#" id="viewSchoolStaff"> View School Staff </a></li>
                    <li class="nav-item"><a href="#"> Link 1</a></li>
                    <li class="nav-item"><a href="#"> Link 1</a></li>
                </ul>                
            </div>
          </li>
          
          <li class="nav-item">
            <a class="nav-link" data-toggle="collapse" href="#payrollSettings" role="button" aria-expanded="false" aria-controls="payrollSettings">
              <span data-feather="users"></span>
              Payroll Settings
            </a>
            <div class="collapse" id="payrollSettings">
                <ul class="" style="list-style-type:none;">
                    <li class="nav-item"><a href="#" id="gradeLevelPay"> Grade Level Pay </a></li>
                    <li class="nav-item"><a href="#" id="additionDeduction"> Addition/Deduction Rates</a></li>
                    <li class="nav-item"><a href="#"> Payroll Fields </a></li>
                </ul>                
            </div>
          </li>

        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Saved reports</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span data-feather="file-text"></span>
              Current month
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span data-feather="file-text"></span>
              Last quarter
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">

    </main>
  </div>
</div>

<div class="modal fade" id="payrollModal" tabindex="-1" aria-labelledby="payrollModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">        
      <div class="modal-header">
          <h5 class="modal-title" id="payrollModalLabel">Staff Profile</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times</span>
          </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>      
  </div>
</div>

<!-- JS, Popper.js, and jQuery -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
<script src="js/main.js" type="module"></script>
</body>
</html>