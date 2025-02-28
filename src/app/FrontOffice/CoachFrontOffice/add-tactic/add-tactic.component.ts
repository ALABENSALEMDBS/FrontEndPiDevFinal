import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import Konva from 'konva';
import  RecordRTC from 'recordrtc';
import { TacticService } from 'src/app/services/serviceCoatch/servicetacticcoatch/tactic.service';

@Component({
    selector: 'app-add-tactic',
    templateUrl: './add-tactic.component.html',
    styleUrls: ['./add-tactic.component.css'],
    standalone: false
})
export class AddTacticComponent implements OnInit {
  avoidAdd() {
    this.rout.navigate(['coatch/listTactic']); 
  }
  successMessage: string = '';
  errorMessage: string = '';



  @ViewChild('canvasContainer', { static: true }) container!: ElementRef;

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  /**
   * ✅ { static: false } → Utilisé quand l'élément HTML dépend de la logique dynamique, comme *ngIf.
     🔴 { static: true } → Utilisé si l'élément est présent dans le DOM dès le début.
   */
  stage: Konva.Stage | undefined;
  layer: Konva.Layer | undefined;
  selectedItem: string | null = null;

  nameTactic: string = '';
  descriptionTactic: string = '';
  videoPath: string | null = null;
  imagePath: string ='';

  // Enregistrement vidéo
  mediaRecorder!: RecordRTC;
  isRecording: boolean = false;
  stream!: MediaStream;


  //canvasTouched: boolean = false;
  isVideoVisible: boolean = false;

  constructor(private tacticservic: TacticService, private rout:Router) { }

  ngOnInit(): void {
    this.initializeField();
  }


  initializeField(): void {
    // Crée le terrain
    this.stage = new Konva.Stage({
      container: this.container.nativeElement,
      width: 800,
      height: 400,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Dessiner le terrain
    const field = new Konva.Rect({
      x: 50,
      y: 50,
      width: 700,
      height: 300,
      fill: 'green',
      stroke: 'white',
      strokeWidth: 2,
      cornerRadius: 15,
    });
    this.layer.add(field);

    // Ajouter une ligne médiane
    this.layer.add(
      new Konva.Line({
        points: [400, 50, 400, 350],
        stroke: 'white',
        strokeWidth: 2,
      })
    );

    // Cercle central
    this.layer.add(
      new Konva.Circle({
        x: 400,
        y: 200,
        radius: 40,
        stroke: 'white',
        strokeWidth: 2,
      })
    );

    // Ajouter les zones de surface de réparation
    this.layer.add(
      new Konva.Rect({
        x: 50,
        y: 125,
        width: 100,
        height: 150,
        stroke: 'white',
        strokeWidth: 2,
      })
    );
    this.layer.add(
      new Konva.Rect({
        x: 650,
        y: 125,
        width: 100,
        height: 150,
        stroke: 'white',
        strokeWidth: 2,
      })
    );

    // Ajouter les buts
    this.layer.add(
      new Konva.Rect({
        x: 50,
        y: 175,
        width: 5,
        height: 50,
        fill: 'white',
        stroke: 'white',
        strokeWidth: 2,
      })
    );
    this.layer.add(
      new Konva.Rect({
        x: 745,
        y: 175,
        width: 5,
        height: 50,
        fill: 'white',
        stroke: 'white',
        strokeWidth: 2,
      })
    );

    // Ajouter les points de penalty
    this.layer.add(
      new Konva.Circle({
        x: 120,
        y: 200,
        radius: 3,
        fill: 'white',
      })
    );
    this.layer.add(
      new Konva.Circle({
        x: 680,
        y: 200,
        radius: 3,
        fill: 'white',
      })
    );

    // Ajouter le point central
    this.layer.add(
      new Konva.Circle({
        x: 400,
        y: 200,
        radius: 5,
        fill: 'white',
      })
    );

    this.layer.draw();
  }

  // Gestion du click sur un menu item
  onMenuItemClick(type: string): void {
    this.selectedItem = type;
  }

  // Gestion du click sur le canvas
  onCanvasClick(event: MouseEvent): void {


    
    if (this.selectedItem && this.stage && this.layer) {
        const position = this.stage.getPointerPosition();
        if (position) {
            if (this.selectedItem === 'text') {
              const newText = new Konva.Text({
                x: position.x,
                y: position.y,
                text: 'Double-cliquez pour modifier',
                fontSize: 20,
                fontFamily: 'Arial',
                fill: 'black',
                draggable: true,
            });
            
            const transformer = new Konva.Transformer({
                nodes: [newText],
                enabledAnchors: ['top-left',
                                'top-right',
                                'bottom-left',
                                'bottom-right',
                                'middle-left',
                                'middle-right',],
                boundBoxFunc: (oldBox, newBox) => {
                    if (newBox.width < 30) {
                        return oldBox;
                    }
                    return newBox;
                },
            });
            
            // Bouton Modifier
            const editButton = new Konva.Rect({
                x: newText.x(),
                y: newText.y() - 30,
                width: 80,
                height: 25,
                fill: 'blue',
                cornerRadius: 5,
                visible: false,
            });
            
            const editText = new Konva.Text({
                x: editButton.x() + 10,
                y: editButton.y() + 5,
                text: 'Modifier',
                fontSize: 14,
                fill: 'white',
                visible: false,
            });
            
            // Bouton Supprimer
            const deleteButton = new Konva.Rect({
                x: newText.x() + 90,
                y: newText.y() - 30,
                width: 80,
                height: 25,
                fill: 'red',
                cornerRadius: 5,
                visible: false,
            });
            
            const deleteText = new Konva.Text({
                x: deleteButton.x() + 10,
                y: deleteButton.y() + 5,
                text: 'Supprimer',
                fontSize: 14,
                fill: 'white',
                visible: false,
            });
            
            // Fonction pour afficher les boutons Modifier et Supprimer
            newText.on('dblclick', () => {
                editButton.visible(true);
                editText.visible(true);
                deleteButton.visible(true);
                deleteText.visible(true);
                transformer.nodes([newText]);
                this.layer!.batchDraw();
            });

            // Mettre à jour la position des boutons lorsque le texte est déplacé
            newText.on('dragmove', () => {
              const newPosition = newText.getPosition();
              editButton.position({ x: newPosition.x, y: newPosition.y - 30 });
              editText.position({ x: newPosition.x + 10, y: newPosition.y - 25 });
              deleteButton.position({ x: newPosition.x + 90, y: newPosition.y - 30 });
              deleteText.position({ x: newPosition.x + 100, y: newPosition.y - 25 });
              this.layer!.batchDraw();
            });
            
            // Fonction pour afficher l'input de modification
            const showInput = () => {
                const textPosition = newText.getAbsolutePosition();
            
                const input = document.createElement('input');
                input.type = 'text';
                input.value = newText.text();
                input.style.position = 'absolute';
                input.style.top = `${textPosition.y + 1000}px`;
                input.style.left = `${textPosition.x + 490}px`;
                input.style.fontSize = '20px';
                input.style.border = '1px solid black';
                input.style.padding = '2px';
                input.style.zIndex = '100';
                document.body.appendChild(input);
                input.focus();
            
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        newText.text(input.value);
                        document.body.removeChild(input);
                        hideButtons();
                        this.layer!.batchDraw();
                    }
                });
            
                input.addEventListener('blur', () => {
                    newText.text(input.value);
                    document.body.removeChild(input);
                    hideButtons();
                    this.layer!.batchDraw();
                });
            };
            
            // Fonction pour supprimer le texte
            const deleteTextElement = () => {
                newText.destroy();
                editButton.destroy();
                editText.destroy();
                deleteButton.destroy();
                deleteText.destroy();
                transformer.destroy();
                this.layer!.batchDraw();
            };
            
            // Fonction pour cacher les boutons
            const hideButtons = () => {
                editButton.visible(false);
                editText.visible(false);
                deleteButton.visible(false);
                deleteText.visible(false);
                transformer.nodes([]);
                this.layer!.batchDraw();
            };
            
            // Événement sur les boutons
            editButton.on('click', showInput);
            editText.on('click', showInput);
            deleteButton.on('click', deleteTextElement);
            deleteText.on('click', deleteTextElement);
            
            // Ajouter les éléments à la couche
            this.layer.add(newText);
            this.layer.add(transformer);
            this.layer.add(editButton);
            this.layer.add(editText);
            this.layer.add(deleteButton);
            this.layer.add(deleteText);
            this.layer.draw();
            
            // Cacher les boutons lorsqu'on clique en dehors
            this.stage.on('click', (e) => {
                if (e.target !== newText && e.target !== editButton && e.target !== editText && e.target !== deleteButton && e.target !== deleteText) {
                    hideButtons();
                }
            });
            

            } else {
                // Gestion des images comme avant
                const imagePath =
                    this.selectedItem === 'j1'
                        ? 'assets/images/j1.png'
                        : this.selectedItem === 'h1'
                            ? 'assets/images/h1.png'
                            : this.selectedItem === 'h2'
                                ? 'assets/images/h2.png'
                                : this.selectedItem === 'fl1'
                                    ? 'assets/images/fl1.png'
                                    : this.selectedItem === 'b2'
                                        ? 'assets/images/b2.png'
                                        : this.selectedItem === 'c1'
                                            ? 'assets/images/c1.png'
                                            : this.selectedItem === 'c2'
                                                ? 'assets/images/c2.png'
                                                : this.selectedItem === 'j4'
                                                    ? 'assets/images/j4.png'
                                                    : this.selectedItem === 'f1'
                                                        ? 'assets/images/f1.png'
                                                        : this.selectedItem === 'j5'
                                                            ? 'assets/images/j5.png'
                                                            : null;

                if (imagePath) {
                    const imageObj = new Image();
                    imageObj.src = imagePath;

                    imageObj.onload = () => {
                        const newItem = new Konva.Image({
                            x: position.x,
                            y: position.y,
                            image: imageObj,
                            width: 60,
                            height: 60,
                            draggable: true,
                        });

                        const transformer = new Konva.Transformer({
                            nodes: [newItem],
                            enabledAnchors: [
                                'top-left',
                                'top-right',
                                'bottom-left',
                                'bottom-right',
                                'middle-left',
                                'middle-right',
                            ],
                            boundBoxFunc: (oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            },
                        });

                        newItem.on('dblclick', () => {
                            newItem.destroy();
                            transformer.destroy();
                            this.layer!.batchDraw();
                        });

                        this.layer!.add(newItem);
                        this.layer!.add(transformer);
                        this.layer!.batchDraw();

                        let transformerActive = false;
                        newItem.on('click', () => {
                            if (transformerActive) {
                                transformer.nodes([]);
                                transformerActive = false;
                            } else {
                                transformer.nodes([newItem]);
                                transformerActive = true;
                            }
                            this.layer!.batchDraw();
                        });
                    };
                }
            }
        }
        this.selectedItem = null;
    }
}



          // Démarrer l'enregistrement vidéo
        async startRecording(): Promise<void> {
          this.isRecording = true;
          //this.isVideoVisible = false; // Masquer la vidéo lorsque l'enregistrement démarre

          console.log("Enregistrement démarré");

          try {
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (!canvas) {
              console.error('Canvas introuvable');
              return;
            }

            // Capturer le flux du canvas
            this.stream = canvas.captureStream(60); // Capture à 60 FPS

            // Initialiser l'enregistreur avec le flux capturé
            this.mediaRecorder = new RecordRTC(this.stream, { mimeType: 'video/mp4' });

            // Attendre que le flux soit prêt
            setTimeout(() => {
              this.mediaRecorder.startRecording();
      
              // Mettre à jour périodiquement le canvas même s'il n'y a pas de changements
              const updateCanvas = () => {
                if (this.isRecording) {
                  this.layer!.batchDraw(); // Forcer la mise à jour du canvas
                  requestAnimationFrame(updateCanvas); // Appel récursif pour la mise à jour continue
                }
              };
              requestAnimationFrame(updateCanvas);

            }, 100); // Attendre un court instant pour s'assurer que le flux est bien capturé

          } catch (error) {
            console.error('Erreur lors du démarrage de l’enregistrement :', error);
          }
      }

      // Arrêter l'enregistrement vidéo
      stopRecording(): void {
        this.isRecording = false;
        this.isVideoVisible = true; // Rendre la vidéo visible après l'arrêt de l'enregistrement
        this.videoPath = `${this.nameTactic}.mp4`;

        this.mediaRecorder.stopRecording(() => {
          

          const videoURL = this.mediaRecorder.toURL();
          this.videoPlayer.nativeElement.src = videoURL;
        });
      }

//****************************************************************************************** */
      confirmDelete() {
        if (this.isVideoVisible && confirm("Voulez-vous vraiment supprimer la vidéo ?")) {
          this.isVideoVisible = false;
        } else if (!this.isVideoVisible) {
          this.isVideoVisible = true;
        }
      }
      
//********************************* */

  
  
  isTacticVisible(): boolean {
    return this.nameTactic.trim() !== '' && this.descriptionTactic.trim() !== '';
  }

  uploadError: string | null = null;
  uploadResponse: any;
  
  saveTactic(): void {
      if (!this.canvasContainer) {
          this.uploadError = 'Image not found.';
          return;
      }
  
      html2canvas(this.canvasContainer.nativeElement).then(canvas => {
          canvas.toBlob(async blob => {
              if (blob) {
                  try {
                      // Upload de l'image
                      const imageFile = new File([blob], `${this.nameTactic}.png`, { type: 'image/png' });
                      await this.uploadFile(imageFile);
  
                      // Vérifier si une vidéo existe et l'uploader
                      let videoUrl: string | null = null;
                      if (this.videoPath && this.mediaRecorder) {
                          const videoBlob = this.mediaRecorder.getBlob();
                          if (videoBlob) {
                              const videoFile = new File([videoBlob], `${this.nameTactic}.mp4`, { type: 'video/mp4' });
                              await this.uploadFile(videoFile);
                              videoUrl = `http://localhost/tactics/${this.nameTactic}.mp4`;
                          }
                      }
  
                      // Ajouter la tactique après l'upload
                      this.addTactic(videoUrl);
                  } catch (error) {
                      console.error('Upload failed:', error);
                      this.uploadError = 'Upload process failed.';
                  }
              } else {
                  this.uploadError = 'Failed to create blob from canvas.';
              }
          }, 'image/png');
      }).catch(error => {
          this.uploadError = 'Error capturing image: ' + error.message;
          console.error('Error capturing image:', error);
      });
  }
  
  uploadFile(file: File): Promise<void> {
      return new Promise((resolve, reject) => {
          this.uploadError = null;
          this.tacticservic.uploadFile(file).subscribe({
              next: (response) => {
                  console.log('Upload successful:', response);
                  resolve();
              },
              error: (error) => {
                  this.uploadError = 'Upload failed: ' + error.message;
                  console.error('Upload error:', error);
                  reject(error);
              }
          });
      });
  }
  
  addTactic(videoUrl: string | null): void {
      const tactic = {
          nameTactic: this.nameTactic,
          descriptionTactic: this.descriptionTactic,
          photoTactic: `http://localhost/tactics/${this.nameTactic}.png`,
          videoTactic: videoUrl, // Stocke null si aucune vidéo
      };
  
      this.tacticservic.addtactic(tactic).subscribe({
          next: (response) => {
              console.log('Tactic added successfully:', response);
              window.location.reload();
          },
          error: (error) => {
              console.error('Error adding tactic:', error);
              this.uploadError = 'Failed to add tactic: ' + error.message;
          }
      });
  }
  

}

/**
  nameTactic: string = '';
  descriptionTactic: string = '';
  videoPath: string | null = null;
  imagePath: string ='';
 */
//************************************************************************************************************* */

  // // Sauvegarder la tactique
  // async saveTactic(): Promise<void> {
  //   if (!this.nameTactic || !this.descriptionTactic) {
  //     alert('Veuillez renseigner le nom et la description de la tactique.');
  //     return;
  //   }

  //   try {
  //     // 1. Sauvegarder l'image du canvas
  //     const canvasElement = this.container.nativeElement.querySelector('canvas');
  //     if (!canvasElement) {
  //       console.error('Canvas element not found');
  //       return;
  //     }
  //     const imageDataURL = canvasElement.toDataURL('image/png');
  //     const imageName = `${this.nameTactic}.png`;
  //     this.imagePath = imageName;  //Stock imagePath

  //     // Convertir l'image en Blob
  //     const imageBlob = await this.dataURItoBlob(imageDataURL);
  //     await this.saveFile(imageBlob, imageName);

  //     // 2. Sauvegarder la vidéo (si elle existe)
  //     if (this.isVideoVisible && this.mediaRecorder) {
  //       const blob = this.mediaRecorder.getBlob();
  //       const videoName = `${this.nameTactic}.mp4`;
  //       this.videoPath = videoName; // Stock videoPath
  //       await this.saveFile(blob, videoName);
  //     }

  //     // 3. Préparer les données pour le service
  //     const tacticData = {
  //       nameTactic: this.nameTactic,
  //       descriptionTactic: this.descriptionTactic,
  //       photoTactic: this.imagePath,
  //       videoTactic: this.isVideoVisible ? this.videoPath : null, // Laisser vide si pas de vidéo
  //     };

  //     // 4. Appeler le service pour sauvegarder la tactique
  //     this.tacticservic.addtactic(tacticData).subscribe(
  //      (response) => {
  //        console.log('Tactique sauvegardée avec succès !', response);
  //        this.successMessage = 'Tactic ajouté avec succès !';
  //        this.errorMessage = '';
  //        window.location.reload();
  //      },
  //      (error) => {
  //        console.error('Erreur lors de la sauvegarde de la tactique :', error);
  //        this.errorMessage = 'Erreur lors de l’ajout du Tactic.';
  //        this.successMessage = '';
  //       }
  //     );

  //     console.log('Tactique sauvegardée localement (simulé).', tacticData);

  //   } catch (error) {
  //     console.error('Erreur lors de la sauvegarde de la tactique :', error);
  //     alert('Erreur lors de la sauvegarde de la tactique.');
  //   }
  // }

  // // Fonction utilitaire pour convertir une data URI en Blob
  // dataURItoBlob(dataURI: string): Promise<Blob> {
  //   return new Promise((resolve, reject) => {
  //     const byteString = atob(dataURI.split(',')[1]);
  //     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //     const ab = new ArrayBuffer(byteString.length);
  //     const ia = new Uint8Array(ab);
  //     for (let i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //     }
  //     resolve(new Blob([ab], { type: mimeString }));
  //   });
  // }

  // // Fonction utilitaire pour sauvegarder un fichier (Blob)
  // async saveFile(blob: Blob, filename: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.style.display = 'none';
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //     resolve();
  //   });
  // }