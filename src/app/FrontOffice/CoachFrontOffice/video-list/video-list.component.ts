import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/serviceVideoS/video.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css',
  imports: [CommonModule],
})
export class VideoListComponent implements OnInit {

  videos: string[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.videoService.getAllVideos().subscribe(data => this.videos = data);
  }

  getVideoUrl(filename: string): string {
    return this.videoService.streamVideo(filename);
  }
}
