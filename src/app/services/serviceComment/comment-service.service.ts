import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {

  private stompClient: any; // Utilisation de `any` au lieu de `Client` directement

  connect(videoId: string, onMessage: (msg: any) => void): void {
    const socket = new SockJS('http://localhost:8089/PiDevBackEndProject/ws-chat');

    // Crée un client Stomp
    this.stompClient = Stomp.over(socket);

    // Connexion au WebSocket
    this.stompClient.connect({}, () => {
      // S'abonner aux commentaires de cette vidéo
      this.stompClient?.subscribe(`/topic/comments/${videoId}`, (message: any) => {
        onMessage(JSON.parse(message.body));
      });
    });
  }

  sendComment(videoId: string, comment: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(`/app/comment/${videoId}`, {}, JSON.stringify(comment));
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Déconnecté du WebSocket');
      });
    }
  }
}
