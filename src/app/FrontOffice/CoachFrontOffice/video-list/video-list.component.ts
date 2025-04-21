import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/serviceVideoS/video.service';
import { VideoCommentComponent } from '../video-comment/video-comment.component'; // Importer le composant de commentaires

@Component({
  selector: 'app-video-list',
  standalone: true,
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css'],
  imports: [CommonModule, VideoCommentComponent], // Ajouter VideoCommentComponent ici
})
export class VideoListComponent implements OnInit {

  videos: string[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    // Charger la liste des vidéos depuis le service
    this.videoService.getAllVideos().subscribe(data => this.videos = data);
  }

  getVideoUrl(filename: string): string {
    return this.videoService.streamVideo(filename);
  }
}
