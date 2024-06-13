import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { StaffService } from 'src/app/Core/Services/staff.service';
declare var $: any;

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
})
export class DoctorsComponent implements OnInit {

  searchTerm: string = ''
  doctors: any[] = []
  recentMessages: any[] = []
  openedMessages: any[] = []
  openedDoctor!: any
  isOpen: boolean = false
  receiverId!: string
  sendMessageForm!: FormGroup
  selectedChat?: { id: number, recepientName: string }
  chats: { id: number, recepientName: string }[] = [
    {
      id: 1,
      recepientName: "Dr. Mohamed"
    },
    {
      id: 2,
      recepientName: "Dr. Samy"
    },
    {
      id: 3,
      recepientName: "Dr. Shimaa"
    },
    {
      id: 4,
      recepientName: "Dr. Sanaa"
    },
  ]

  constructor(
    private _StaffService: StaffService,
    private _Renderer2: Renderer2,
    private _ElementRef: ElementRef,
    private _FormBuilder: FormBuilder,
    public _AuthService: AuthService) { }

  dropToggle() {
    $('.drop').fadeToggle();
  }

  selectChat(id: string) {
    this.isOpen = true;
    this.sendMessageForm.get('receiverId')?.setValue(id);
    // continue logic
    console.log(this.recentMessages);
    for(let element of this.recentMessages){
      if (element?.clientId == id) {
        this.openedMessages = element.messages
        console.log('messages', this.openedMessages);
        if (element.messages[0].isSent) {
          if (element.messages[0].receiverRole == 2) {
            this._StaffService.getSpecificDoctor(id).subscribe({
              next: response => {
                console.log('get doctor');
                this.openedDoctor = response
                // console.log(this.openedDoctor);
              }, error: err => {
                console.error('error', err);
              }
            })
          }
        }
      }
      else {
        this.openedMessages = []
        this._StaffService.getSpecificDoctor(id).subscribe({
          next: response => {
            this.openedDoctor = response
          }
        })
      }
    }
  }

  sendMessage() {
    this._StaffService.sendMessage(this.sendMessageForm.value).subscribe({
      next: response => {
        console.log(response);
        if (response.message == 'success') {
          this.sendMessageForm.get('content')?.setValue('');
          console.log('form', this.sendMessageForm.value);
          console.log('res', response);
          this.getMessages();
        }
      }, error: err => {
        console.log(err);
      }
    })
  }

  getMessages() {
    switch (this._AuthService.user?.userRole) {
      case 'admin':
        this._StaffService.getMessages(this._AuthService.user?.id!, 0).subscribe({
          next: response => {
            this.recentMessages = response
          }, error: err => {
            console.log(err);
          }
        })
        break;
      case 'doctor':
        this._StaffService.getMessages(this._AuthService.user?.id!, 2).subscribe({
          next: response => {
            this.recentMessages = response
          }, error: err => {
            console.log(err);
          }
        })
        break;
    }
  }

  getMessagesForOpenedChat() {
    for (let element of this.recentMessages) {
      if (element.clientId == this.openedDoctor?.id) {
        this.openedMessages = element.messages
        break;
      }
    }
  }

  getTimeOnly(dateTime: any): any {
    let date = new Date(dateTime);
    return date.toLocaleTimeString();
  }

  getDateOnly(dateTime?: any): any {
    if (dateTime == undefined) {
      let today = new Date();
      return today.toLocaleDateString();
    } else {
      let date = new Date(dateTime);
      return date.toLocaleDateString();
    }
  }

  ngOnInit(): void {
    this.sendMessageForm = this._FormBuilder.group({
      content: ['', [Validators.required]],
      senderId: [this._AuthService.user?.id, [Validators.required]],
      receiverId: ['', [Validators.required]],
      messageType: [2, [Validators.required]]
    })
    this._StaffService.getAllDoctors().subscribe({
      next: response => {
        this.doctors = response
        console.log(this.doctors);
      }
    })

    let interval = setInterval(() => {
      this.getMessages();
      this.getMessagesForOpenedChat();
    }, 100)
  }
}
