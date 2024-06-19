import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from 'src/app/Core/Services/staff.service';
import { AddCheckupComponent } from '../add-checkup/add-checkup.component';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-checkup',
  templateUrl: './checkup.component.html',
  styleUrls: ['./checkup.component.scss'],
})
export class CheckupComponent implements OnInit {

  checkupList: any[] = []
  searchTerm: string = ''
  selectedFile!: File
  resultFormData!: FormGroup

  constructor(
    private _StaffService: StaffService,
    private _ToastrService: ToastrService,
    private _MatDialog: MatDialog,
    private _FormBuilder: FormBuilder
  ) { }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

    console.log(this.selectedFile);
  }

  submitForm(form: NgForm) {
    console.log(form.value.checkupId, typeof(form.value.checkupId));
    console.log('form', form.value);
    const formData = new FormData();
    
    // Append form values to FormData
    Object.keys(form.value).forEach(key => {
      formData.append(key, form.value[key]);
      console.log(formData);
    });
    // Append the selected file to FormData
    if (this.selectedFile) {
      formData.append('result', this.selectedFile, this.selectedFile.name);
      console.log(formData);
    }
    console.log('form-data', formData);
    this._StaffService.addCheckupResult(formData).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
    // console.log(this.resultFormData.value);
    // this._StaffService.addCheckupResult(this.selectedFile).subscribe({
    //   next: response => {
    //     console.log(response);
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // })
  }

  edit(checkup: any) {
    const dialogRef = this._MatDialog.open(AddCheckupComponent, {
      data: checkup
    })

    dialogRef.afterClosed().subscribe(message => {
      if (message == 'updated') {
        this.getAllCheckups()
        this._ToastrService.success('Checkup updated successfully')
      }
    })
  }

  add() {
    const dialogRef = this._MatDialog.open(AddCheckupComponent)

    dialogRef.afterClosed().subscribe(message => {
      if (message == 'added') {
        this.getAllCheckups()
        this._ToastrService.success('Checkup added successfully')
      }
    })
  }

  delete(id: number) {
    this._StaffService.deleteCheckup(id).subscribe({
      next: response => {
        this.getAllCheckups()
      },
      error: error => {
        console.log(error);
      }
    })
  }

  dropToggle() {
    $('.drop').fadeToggle();
  }

  getAllCheckups() {
    this._StaffService.getAllCheckup().subscribe({
      next: response => {
        this.checkupList = response
      },
      error: error => {
        console.log(error);
      }
    })
  }

  ngOnInit(): void {
    this.resultFormData = this._FormBuilder.group({
      patientId: ['', [Validators.required]],
      checupId: [0, Validators.required],
      result: [null, [Validators.required]]
    })
    this.getAllCheckups()
  }
}
