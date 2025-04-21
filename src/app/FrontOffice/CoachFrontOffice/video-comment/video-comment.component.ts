import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommentServiceService } from 'src/app/services/serviceComment/comment-service.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Comment } from 'src/core/models/Comment'; // <-- modèle typé

@Component({
  selector: 'app-video-comment',
  standalone: true,
  templateUrl: './video-comment.component.html',
  styleUrls: ['./video-comment.component.css'],
  imports: [CommonModule, FormsModule]
})
export class VideoCommentComponent implements OnInit, OnDestroy {
  @Input() videoId!: string;
  comments: Comment[] = [];
  newComment: string = '';
  username: string = 'Utilisateur'; // à remplacer plus tard dynamiquement

  constructor(
    private commentService: CommentServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Charger les anciens commentaires depuis le backend
    this.http.get<Comment[]>(`http://localhost:8089/PiDevBackEndProject/api/comments/${this.videoId}`).subscribe(data => {
      this.comments = data;
    });

    // Se connecter et écouter les nouveaux commentaires
    this.commentService.connect(this.videoId, (comment: Comment) => {
      this.comments.push(comment);
    });
  }

  send(): void {
    if (this.newComment.trim() !== '') {
      const comment: Comment = {
        videoId: this.videoId,
        username: this.username,
        content: this.newComment,
        timestamp: new Date().toISOString()
      };
      this.commentService.sendComment(this.videoId, comment);
      this.newComment = '';
    }
  }

  ngOnDestroy(): void {
    this.commentService.disconnect();
  }
}
