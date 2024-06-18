import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from 'src/app/Core/Services/staff.service';
import { AddCheckupComponent } from '../add-checkup/add-checkup.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-checkup',
  templateUrl: './checkup.component.html',
  styleUrls: ['./checkup.component.scss'],
})
export class CheckupComponent implements OnInit {

  checkupList: any[] = []
  searchTerm: string = ''

  constructor(
    private _StaffService: StaffService,
    private _ToastrService: ToastrService,
    private _MatDialog: MatDialog,
    private _FormBuilder: FormBuilder
  ) { }

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
    this.getAllCheckups()
  }
}
