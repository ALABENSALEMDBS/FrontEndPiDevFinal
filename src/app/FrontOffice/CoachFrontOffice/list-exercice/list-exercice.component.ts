import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExerciceService } from 'src/app/services/serviceCoatch/serviceExercice/exercice.service';
import { Exercices } from 'src/core/models/exercice';

@Component({
    selector: 'app-list-exercice',
    templateUrl: './list-exercice.component.html',
    styleUrls: ['./list-exercice.component.css'],
    standalone: false


})
export class ListExerciceComponent {
 exercice: Exercices[] = [];
 selectedVideo: SafeResourceUrl | null = null;

      constructor(private coatchService: ExerciceService, private sanitizer: DomSanitizer ) {}

      ngOnInit(): void {
        this.getExercices();
      }

      getExercices(): void {
        this.coatchService.getAllExercices().subscribe(data => {
          this.exercice = data;
        });
      }


      deleteExercices(id:any){
        this.coatchService.delExercices(id).subscribe(()=>{
          console.log("deleted exercices !!!!")
          window.location.reload()
        })
      }

      /**
       * Sécurise une URL YouTube pour être utilisée dans un iframe
       */
      getYoutubeEmbedUrl(url: string): SafeResourceUrl {
        const videoId = this.extractYoutubeVideoId(url);
        if (videoId) {
          const safeUrl = `https://www.youtube.com/embed/${videoId}`;
          return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl('');
      }

       /**
   * Extrait l'ID de la vidéo YouTube depuis une URL standard
   */
  private extractYoutubeVideoId(url: string): string | null {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  // Ouvre la vidéo dans l'iframe
  openVideo(videoUrl: string): void {
    console.log('Video clicked! URL:', videoUrl);
    const videoId = this.extractYoutubeVideoId(videoUrl);
    if (videoId) {
      this.selectedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
      console.log('Selected video:', this.selectedVideo);
    }
  }


  closeVideo(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('fullscreen-video')) {
      console.log('Closing video');
      this.selectedVideo = null;
    }
  }

  // Récupère la miniature de la vidéo YouTube
  getYoutubeThumbnail(url: string): string {
    const videoId = this.extractYoutubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  }



  }
