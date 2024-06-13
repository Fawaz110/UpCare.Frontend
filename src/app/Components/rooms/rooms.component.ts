import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StaffService } from 'src/app/Core/Services/staff.service';
import { RoomDataComponent } from '../room-data/room-data.component';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent {

  rooms: any[] = []
  roomNumber!: number
  constructor(private _StaffService: StaffService, private _MatDialog: MatDialog, private _ToastrService: ToastrService) {
    this.getRooms()
  }

  addRoom() {
    const dialogRef = this._MatDialog.open(RoomDataComponent);
    dialogRef.afterClosed().subscribe(message => {
      if (message == 'added') {
        this._ToastrService.success('Added Successfully <3')
      } else {
        this._ToastrService.error('Fail To Add Room')
      }
    });
  }
  updateRoom(data: object) {
    const dialogRef = this._MatDialog.open(RoomDataComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(message => {
      if (message == 'updated') {
        this._ToastrService.success('Updated Successfully <3')
      } else {
        this._ToastrService.error('Fail To Update Room')
      }
    });
  }

  getRooms() {
    this._StaffService.getAllRooms().subscribe({
      next: response => {
        this.rooms = response
      }
    })
  }

  dropToggle() {
    $('.drop').fadeToggle();
  }
}
