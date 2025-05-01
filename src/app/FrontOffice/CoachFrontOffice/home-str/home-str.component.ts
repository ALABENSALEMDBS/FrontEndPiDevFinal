import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/services/serviceCoatch/serviceRoom/room.service';
import { Room } from 'src/core/models/Room ';

@Component({
  selector: 'app-home-str',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-str.component.html',
  styleUrl: './home-str.component.css'
})
export class HomeStrComponent implements OnInit {

  rooms: Room[] = [];
  createRoomForm: FormGroup;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createRoomForm = this.formBuilder.group({
      roomName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadActiveRooms();
  }

  loadActiveRooms(): void {
    this.roomService.getActiveRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  createRoom(): void {
    if (this.createRoomForm.valid) {
      const roomName = this.createRoomForm.get('roomName')?.value;

      this.roomService.createRoom(roomName).subscribe({
        next: (room) => {
          this.router.navigate(['/broadcast', room.id]);
        },
        error: (error) => {
          console.error('Error creating room:', error);
        }
      });
    }
  }

  joinRoom(roomId: string): void {
    this.router.navigate(['/view', roomId]);
  }

}
