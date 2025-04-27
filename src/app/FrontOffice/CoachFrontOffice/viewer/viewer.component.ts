import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LivestreamService } from 'src/app/services/serviceCoatch/serviceLivestream/livestream.service';
import { RoomService } from 'src/app/services/serviceCoatch/serviceRoom/room.service';
import { LiveStream } from 'src/core/models/LiveStream';
import { Room } from 'src/core/models/Room ';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.css'
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  roomId: string = '';
  room: Room | null = null;
  liveStream: LiveStream | null = null;
  peerConnection: RTCPeerConnection | null = null;
  isStreamActive: boolean = false;
  isBuffering: boolean = true;
  errorMessage: string = '';
  statusMessage: string = 'Chargement du stream...';

  private offerSubscription?: Subscription;
  private iceCandidateSubscription?: Subscription;
  private roomStatusSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livestreamService: LivestreamService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    if (!this.roomId) {
      this.router.navigate(['/']);
      return;
    }

    this.loadRoomInfo();
    this.setupWebRTC();

    setTimeout(() => {
        this.requestConnection();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.cleanupWebRTC();
  }

  loadRoomInfo(): void {
    this.roomService.getRoom(this.roomId).subscribe({
      next: (room) => {
        this.room = room;
        if (!room.active) {
          this.statusMessage = 'Ce stream n\'est pas actif actuellement';
        } else {
          this.isStreamActive = true;
          console.log("Room active, waiting for stream connection");
        }
      },
      error: (error) => {
        console.error('Error loading room info:', error);
        this.errorMessage = 'Impossible de charger les informations de la room';
      }
    });

    this.livestreamService.getLiveStreamByRoomId(this.roomId).subscribe({
      next: (liveStream) => {
        this.liveStream = liveStream;
        if (liveStream && liveStream.active) {
          this.isStreamActive = true;
          console.log("LiveStream active");
        }
      },
      error: (error) => {
        if (error.status !== 404) {
          console.error('Error loading livestream info:', error);
        }
      }
    });
  }

  setupWebRTC(): void {
    console.log("Setting up WebRTC for room:", this.roomId);
    this.livestreamService.connectToWebSocket(this.roomId);

    // S'abonner aux offres WebRTC
    this.offerSubscription = this.livestreamService.getWebRTCOffers(this.roomId).subscribe({
      next: (offer) => {
        console.log("Received WebRTC offer:", offer);
        try {
          this.handleOffer(JSON.parse(offer));
        } catch (error) {
          console.error("Error parsing WebRTC offer:", error);
          this.errorMessage = "Erreur lors de la connexion au stream";
        }
      },
      error: (error) => {
        console.error("Error in WebRTC offer subscription:", error);
        this.errorMessage = "Erreur lors de la connexion au stream";
      }
    });

    // S'abonner aux candidats ICE
    this.iceCandidateSubscription = this.livestreamService.getICECandidates(this.roomId).subscribe(
      candidate => {
        console.log("Received ICE candidate");
        this.handleRemoteICECandidate(JSON.parse(candidate));
      }
    );

    // S'abonner au statut de la room
    this.roomStatusSubscription = this.livestreamService.getRoomStatus(this.roomId).subscribe({
      next: (status) => {
        console.log("Room status update:", status);
        if (status === 'ended') {
          this.isStreamActive = false;
          this.statusMessage = 'La diffusion est terminée';

          // Recharger les infos de la room pour récupérer le chemin d'enregistrement
          this.loadRoomInfo();
        } else if (status === 'started') {
          this.isStreamActive = true;
          this.statusMessage = '';
        }
      },
      error: (error) => {
        console.error('Error receiving room status:', error);
      }
    });
  }

  cleanupWebRTC(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.offerSubscription) {
      this.offerSubscription.unsubscribe();
    }

    if (this.iceCandidateSubscription) {
      this.iceCandidateSubscription.unsubscribe();
    }

    if (this.roomStatusSubscription) {
      this.roomStatusSubscription.unsubscribe();
    }

    this.livestreamService.disconnectWebSocket();
  }

  handleOffer(offer: RTCSessionDescriptionInit): void {
    console.log("Handling WebRTC offer");
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
      ]
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Événement pour gérer les candidats ICE
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate to broadcaster");
        this.livestreamService.sendICECandidate(this.roomId, JSON.stringify(event.candidate));
      }
    };

    // Événement pour les changements d'état de connexion
    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state changed:", this.peerConnection?.connectionState);
    };

    // Événement pour recevoir les streams
    this.peerConnection.ontrack = (event) => {
      console.log("Received media track!", event.streams);
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = event.streams[0];
        this.statusMessage = '';
        this.isBuffering = false;
        console.log("Video element updated with remote stream");
      }
    };

    // Définir l'offre distante
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        console.log("Set remote description success");
        return this.peerConnection!.createAnswer();
      })
      .then(answer => {
        console.log("Created answer");
        return this.peerConnection!.setLocalDescription(answer);
      })
      .then(() => {
        console.log("Set local description success");
        if (this.peerConnection && this.peerConnection.localDescription) {
          this.livestreamService.sendAnswer(this.roomId, JSON.stringify(this.peerConnection.localDescription));
          console.log("Sent answer to broadcaster");
        }
      })
      .catch(error => {
        console.error('Error handling offer:', error);
        this.errorMessage = 'Erreur lors de la connexion au stream';
      });
  }

  handleRemoteICECandidate(candidate: RTCIceCandidateInit): void {
    if (this.peerConnection) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .then(() => console.log("Added ICE candidate successfully"))
        .catch(error => {
          console.error('Error adding ICE candidate:', error);
        });
    } else {
      console.warn("Cannot add ICE candidate: peer connection not initialized");
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  forceReconnect(): void {
    console.log("Forcing reconnection");
    this.cleanupWebRTC();
    this.setupWebRTC();

    // Envoyer un message pour demander au broadcaster de renvoyer une offre
    this.livestreamService.sendICECandidate(this.roomId, JSON.stringify({
      type: "reconnect-request",
      timestamp: new Date().getTime()
    }));
  }

  requestConnection(): void {
    console.log("Requesting connection to broadcaster");
    this.livestreamService.sendConnectionRequest(this.roomId, {
      viewerId: 'viewer-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().getTime()
    });
  }

}
