import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LivestreamService } from 'src/app/services/serviceCoatch/serviceLivestream/livestream.service';
import { RoomService } from 'src/app/services/serviceCoatch/serviceRoom/room.service';
import { Room } from 'src/core/models/Room ';

@Component({
  selector: 'app-broadcaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './broadcaster.component.html',
  styleUrl: './broadcaster.component.css'
})
export class BroadcasterComponent implements OnInit, OnDestroy {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  roomId: string = '';
  room: Room | null = null;
  isStreaming: boolean = false;
  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  peerConnections: RTCPeerConnection[] = [];
  errorMessage: string = '';
  window = window;

  private answerSubscription?: Subscription;
  private iceCandidateSubscription?: Subscription;
  private connectionRequestSubscription?: Subscription;

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
    this.setupCamera();
  }

  ngOnDestroy(): void {
    this.stopStreaming();
    this.closeCamera();
    this.cleanupWebRTC();
    if (this.connectionRequestSubscription) {
      this.connectionRequestSubscription.unsubscribe();
    }
  }

  loadRoomInfo(): void {
    this.roomService.getRoom(this.roomId).subscribe({
      next: (room) => {
        this.room = room;
        console.log("Room info loaded:", room);
      },
      error: (error) => {
        console.error('Error loading room info:', error);
        this.errorMessage = 'Impossible de charger les informations de la room';
      }
    });
  }

  async setupCamera(): Promise<void> {
    try {
      console.log("Requesting camera access");
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      console.log("Camera access granted");
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.errorMessage = 'Impossible d\'accéder à la caméra ou au microphone';
    }
  }

  closeCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.videoElement && this.videoElement.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  startStreaming(): void {
    if (!this.mediaStream) {
      this.errorMessage = 'Aucun flux média disponible';
      return;
    }

    console.log("Starting livestream");
    this.livestreamService.startLiveStream(this.roomId).subscribe({
      next: () => {
        this.isStreaming = true;
        this.setupMediaRecorder();

        // Configurer WebRTC et WebSocket
        this.setupWebRTC();
      },
      error: (error) => {
        console.error('Error starting livestream:', error);
        this.errorMessage = 'Impossible de démarrer le livestream';
      }
    });
  }

  stopStreaming(): void {
    if (this.isStreaming) {
      console.log("Stopping livestream");
      this.livestreamService.endLiveStream(this.roomId).subscribe({
        next: () => {
          this.isStreaming = false;
          if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }
          this.cleanupWebRTC();
        },
        error: (error) => {
          console.error('Error stopping livestream:', error);
          this.errorMessage = 'Impossible d\'arrêter le livestream';
        }
      });
    }
  }

  setupMediaRecorder(): void {
    if (!this.mediaStream) return;

    console.log("Setting up MediaRecorder");
    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: 'video/webm; codecs=vp8,opus',
        videoBitsPerSecond: 2500000
      });
    } catch (e) {
      console.error('MediaRecorder is not supported or format not supported:', e);
      try {
        // Fallback à un format plus basique
        console.log("Trying fallback to basic WebM format");
        this.mediaRecorder = new MediaRecorder(this.mediaStream, {
          mimeType: 'video/webm'
        });
      } catch (err) {
        console.error('MediaRecorder creation failed:', err);
        this.errorMessage = 'Votre navigateur ne supporte pas l\'enregistrement vidéo';
        return;
      }
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        console.log("Received media chunk of size:", event.data.size);
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      console.log("MediaRecorder stopped, uploading recording");
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      console.log("Created final blob of size:", blob.size);

      // Envoyer le blob au serveur pour enregistrement
      const formData = new FormData();
      formData.append('file', blob, `stream-${this.roomId}.webm`);

      // Utilisez une API REST pour envoyer le fichier terminé
      this.livestreamService.uploadRecording(this.roomId, formData).subscribe({
        next: (response) => {
          console.log('Recording uploaded successfully:', response);
        },
        error: (error) => {
          console.error('Error uploading recording:', error);
        }
      });

      this.recordedChunks = [];
    };

    // Commencer l'enregistrement
    console.log("Starting MediaRecorder");
    this.mediaRecorder.start(10000); // Enregistrer par segments de 10 secondes
  }

  setupWebRTC(): void {
    console.log("Setting up WebRTC connections");
    this.livestreamService.connectToWebSocket(this.roomId);

    // S'abonner aux messages WebRTC
    this.answerSubscription = this.livestreamService.getWebRTCAnswers(this.roomId).subscribe(
      answer => {
        console.log("Received WebRTC answer");
        try {
          this.handleAnswer(JSON.parse(answer));
        } catch (error) {
          console.error("Error parsing answer:", error);
        }
      }
    );

    this.iceCandidateSubscription = this.livestreamService.getICECandidates(this.roomId).subscribe(
      candidate => {
        console.log("Received ICE candidate from viewer");
        try {
          this.handleRemoteICECandidate(JSON.parse(candidate));
        } catch (error) {
          console.error("Error parsing ICE candidate:", error);
        }
      }
    );

  this.connectionRequestSubscription = this.livestreamService.getConnectionRequests(this.roomId).subscribe(
    request => {
      console.log("Received connection request from viewer:", request);
      // Créer une nouvelle connexion pour ce viewer
      this.createPeerConnection();
    }
  );

    // Créer une connexion peer pour les viewers
    this.createPeerConnection();

    // Forcer la création d'une nouvelle offre toutes les 5 secondes
    // jusqu'à ce qu'une réponse soit reçue
    const createOfferInterval = setInterval(() => {
      if (this.peerConnections.length > 0 &&
          this.peerConnections[this.peerConnections.length - 1].connectionState !== 'connected') {
        console.log("Forcing new offer creation");
        this.createPeerConnection();
      } else if (this.answerSubscription && this.peerConnections.some(pc => pc.connectionState === 'connected')) {
        console.log("Connection established, stopping offer interval");
        clearInterval(createOfferInterval);
      }
    }, 5000);
  }

  cleanupWebRTC(): void {
    console.log("Cleaning up WebRTC connections");
    // Fermer toutes les connexions peer
    this.peerConnections.forEach(pc => {
      pc.close();
    });
    this.peerConnections = [];

    // Désabonner des sujets
    if (this.answerSubscription) {
      this.answerSubscription.unsubscribe();
    }

    if (this.iceCandidateSubscription) {
      this.iceCandidateSubscription.unsubscribe();
    }

    this.livestreamService.disconnectWebSocket();
  }

  createPeerConnection(): RTCPeerConnection {
    console.log("Creating new peer connection, current count:", this.peerConnections.length);
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    // Limiter le nombre de connexions pour éviter les surcharges
    if (this.peerConnections.length > 10) {
      console.warn("Too many peer connections, removing oldest ones");
      const oldConnection = this.peerConnections.shift();
      if (oldConnection) {
        oldConnection.close();
      }
    }

    const pc = new RTCPeerConnection(configuration);

    // Ajouter des gestionnaires d'événements pour débogage
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log("ICE gathering state:", pc.iceGatheringState);
    };

    pc.onsignalingstatechange = () => {
      console.log("Signaling state:", pc.signalingState);
    };

    // Ajouter les tracks au peer connection
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        console.log("Adding track to peer connection:", track.kind);
        pc.addTrack(track, this.mediaStream!);
      });
    }

    // Événement pour gérer les candidats ICE
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Generated ICE candidate, sending to viewers");
        this.livestreamService.sendICECandidate(this.roomId, JSON.stringify(event.candidate));
      }
    };

    // Créer une offre SDP et l'envoyer
    pc.createOffer()
      .then(offer => {
        console.log("Created offer");
        return pc.setLocalDescription(offer);
      })
      .then(() => {
        console.log("Set local description success");
        if (pc.localDescription) {
          this.livestreamService.sendOffer(this.roomId, JSON.stringify(pc.localDescription));
          console.log("Sent offer to viewers");
        }
      })
      .catch(error => {
        console.error('Error creating offer:', error);
      });

    this.peerConnections.push(pc);
    return pc;
  }

  handleAnswer(answer: RTCSessionDescriptionInit): void {
    console.log("Handling WebRTC answer");
    const pc = this.peerConnections[this.peerConnections.length - 1];
    if (pc) {
      pc.setRemoteDescription(new RTCSessionDescription(answer))
        .then(() => console.log("Set remote description success"))
        .catch(error => {
          console.error('Error setting remote description:', error);
        });
    } else {
      console.warn("Cannot handle answer: no peer connection available");
    }
  }

  handleRemoteICECandidate(candidate: RTCIceCandidateInit): void {
    console.log("Handling remote ICE candidate");
    const pc = this.peerConnections[this.peerConnections.length - 1];
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(candidate))
        .then(() => console.log("Added ICE candidate successfully"))
        .catch(error => {
          console.error('Error adding ICE candidate:', error);
        });
    } else {
      console.warn("Cannot add ICE candidate: no peer connection available");
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

}
