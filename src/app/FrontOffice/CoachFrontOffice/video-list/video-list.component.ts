import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/serviceVideoS/video.service';
import { VideoCommentComponent } from '../video-comment/video-comment.component';
import { CommentServiceService } from 'src/app/services/serviceComment/comment-service.service';
import { CommentStatsComponent } from '../comment-stats/comment-stats.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css',
  imports: [CommonModule, VideoCommentComponent],
})
export class VideoListComponent implements OnInit {

  stats: any;
  videos: string[] = [];

  constructor(private videoService: VideoService,private commentService: CommentServiceService) {}

  ngOnInit() {
    this.videoService.getAllVideos().subscribe(data => this.videos = data);

    this.commentService.getGlobalCommentStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  getVideoUrl(filename: string): string {
    return this.videoService.streamVideo(filename);
  }
}
