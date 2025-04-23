import { Component } from '@angular/core';
import { VideoService } from 'src/app/services/serviceVideoS/video.service';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrl: './live-stream.component.css'
})
export class LiveStreamComponent {

  private mediaRecorder!: MediaRecorder;
  private recordedChunks: Blob[] = [];
  public isRecording = false;

  constructor(private videoService: VideoService) {}

  async startStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoPreview = document.querySelector('video')!;
    videoPreview.srcObject = stream;

    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (e) => this.recordedChunks.push(e.data);
    this.mediaRecorder.onstop = () => this.uploadVideo();
    this.mediaRecorder.start();

    this.isRecording = true;
  }

  stopStream() {
    this.mediaRecorder.stop();
    this.isRecording = false;

    const stream = (document.querySelector('video')!.srcObject as MediaStream);
    stream.getTracks().forEach(track => track.stop());
    window.location.reload();

  }

  uploadVideo() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.videoService.uploadVideo(blob).subscribe();
    this.recordedChunks = [];
  }

}
