import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { LiveStream } from 'src/core/models/LiveStream';

@Injectable({
  providedIn: 'root'
})
export class LivestreamService {

  private apiUrl = `http://localhost:8089/PiDevBackEndProject/api/livestreams`;
  private stompClient: Client | null = null;
  private roomStatusSubject = new Subject<string>();
  private webrtcOfferSubject = new Subject<string>();
  private webrtcAnswerSubject = new Subject<string>();
  private iceCandidateSubject = new Subject<string>();
  private connectionRequestSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  getConnectionRequests(roomId: string): Observable<any> {
    return this.connectionRequestSubject.asObservable();
  }

  startLiveStream(roomId: string): Observable<LiveStream> {
    return this.http.post<LiveStream>(`${this.apiUrl}/start/${roomId}`, {});
  }

  endLiveStream(roomId: string): Observable<LiveStream> {
    return this.http.post<LiveStream>(`${this.apiUrl}/end/${roomId}`, {});
  }

  uploadRecording(roomId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload/${roomId}`, formData);
  }

  getAllLiveStreams(): Observable<LiveStream[]> {
    return this.http.get<LiveStream[]>(this.apiUrl);
  }

  getActiveLiveStreams(): Observable<LiveStream[]> {
    return this.http.get<LiveStream[]>(`${this.apiUrl}/active`);
  }

  getLiveStream(id: string): Observable<LiveStream> {
    return this.http.get<LiveStream>(`${this.apiUrl}/${id}`);
  }

  getLiveStreamByRoomId(roomId: string): Observable<LiveStream> {
    return this.http.get<LiveStream>(`${this.apiUrl}/room/${roomId}`);
  }

  // WebRTC signaling
  sendOffer(roomId: string, offerSdp: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/webrtc/${roomId}/offer`,
        body: offerSdp
      });
    }
  }

  sendAnswer(roomId: string, answerSdp: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/webrtc/${roomId}/answer`,
        body: answerSdp
      });
    }
  }

  sendICECandidate(roomId: string, iceCandidate: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/webrtc/${roomId}/ice-candidate`,
        body: iceCandidate
      });
    }
  }

  getWebRTCOffers(roomId: string): Observable<string> {
    return this.webrtcOfferSubject.asObservable();
  }

  getWebRTCAnswers(roomId: string): Observable<string> {
    return this.webrtcAnswerSubject.asObservable();
  }

  getICECandidates(roomId: string): Observable<string> {
    return this.iceCandidateSubject.asObservable();
  }

  // Méthode pour s'abonner au statut de la room
  getRoomStatus(roomId: string): Observable<string> {
    return this.roomStatusSubject.asObservable();
  }

  // Connexion WebSocket
  connectToWebSocket(roomId: string): void {
    this.stompClient = new Client({
      webSocketFactory: () => {
        return new SockJS(`http://localhost:8089/PiDevBackEndProject/ws-chat`);
      },
      debug: function(str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket connection established');

      // S'abonner aux statuts de la room
      this.stompClient!.subscribe(`/topic/room/${roomId}`, (message) => {
        this.roomStatusSubject.next(message.body);
      });

      // S'abonner aux offres WebRTC
      this.stompClient!.subscribe(`/topic/webrtc/${roomId}/offer`, (message) => {
        this.webrtcOfferSubject.next(message.body);
      });

      // S'abonner aux réponses WebRTC
      this.stompClient!.subscribe(`/topic/webrtc/${roomId}/answer`, (message) => {
        this.webrtcAnswerSubject.next(message.body);
      });

      // S'abonner aux candidats ICE
      this.stompClient!.subscribe(`/topic/webrtc/${roomId}/ice-candidate`, (message) => {
        this.iceCandidateSubject.next(message.body);
      });

      // S'abonner aux demandes de connexion
      this.stompClient!.subscribe(`/topic/webrtc/${roomId}/connect-request`, (message) => {
        try {
          const request = JSON.parse(message.body);
          this.connectionRequestSubject.next(request);
        } catch (error) {
          console.error("Error parsing connection request:", error);
        }
      });
    };

    this.stompClient.activate();
  }

  // Déconnexion WebSocket
  disconnectWebSocket(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;

      // Réinitialiser les sujets
      this.roomStatusSubject = new Subject<string>();
      this.webrtcOfferSubject = new Subject<string>();
      this.webrtcAnswerSubject = new Subject<string>();
      this.iceCandidateSubject = new Subject<string>();
    }
  }

  sendConnectionRequest(roomId: string, request: any): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log("Sending connection request");
      this.stompClient.publish({
        destination: `/app/webrtc/${roomId}/connect`,
        body: JSON.stringify(request)
      });
    } else {
      console.warn("Cannot send connection request: client not connected");
    }
  }
}
