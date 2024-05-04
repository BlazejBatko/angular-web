import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
})
export class EditEmployeeComponent implements OnInit {
  editEmployeeForm: employeeForm = new employeeForm();

  @ViewChild('employeeForm')
  employeeForm!: NgForm;

  isSubmitted: boolean = false;
  employeeId: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private httpProvider: HttpProviderService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['employeeId'];
    this.getEmployeeDetailById();
  }

  getEmployeeDetailById() {
    this.httpProvider.getEmployeeDetailById(this.employeeId).subscribe(
      (data: any) => {
        var resultData = data.body;
        if (resultData) {
          this.editEmployeeForm.FirstName = resultData.FirstName;
          this.editEmployeeForm.LastName = resultData.LastName;
          this.editEmployeeForm.Email = resultData.Email;
          this.editEmployeeForm.Address = resultData.Address;
          this.editEmployeeForm.Phone = resultData.Phone;
        }
      },
      (error: any) => {}
    );
  }

  EditEmployee(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider
        .updateEmployee(this.employeeId, this.editEmployeeForm)
        .subscribe(
          async (data) => {
            var resultData = data.body;
            this.toastr.success('Employee updated successfully');
            setTimeout(() => {
              this.router.navigate(['/Home']);
            }, 500);
          },
          async (error) => {
            this.toastr.error(error.message);
            setTimeout(() => {
              this.router.navigate(['/Home']);
            }, 500);
          }
        );
    }
  }
}

export class employeeForm {
  FirstName: string = '';
  LastName: string = '';
  Email: string = '';
  Address: string = '';
  Phone: string = '';
}
