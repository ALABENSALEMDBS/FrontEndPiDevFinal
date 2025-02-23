import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TacticService } from 'src/app/services/serviceCoatch/servicetacticcoatch/tactic.service';
import { tactic } from 'src/core/models/tactic';

@Component({
  selector: 'app-list-tactic',
  templateUrl: './list-tactic.component.html',
  styleUrls: ['./list-tactic.component.css']
})
export class ListTacticComponent implements OnInit {
  tactic: tactic[] = [];
  isModalOpen: boolean = false;
  safeVideoUrl: SafeResourceUrl = '';

  constructor(private service: TacticService,private sanitizer: DomSanitizer) {}

  openModal(videoUrl: string) {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }


  ngOnInit(): void {
    this.getTactic();
  }


  getTactic(): void {
    this.service.getAlltactic().subscribe(data => {
      this.tactic = data;
    });
  }


  deleteTactic(id:any){
    this.service.deltactic(id).subscribe(()=>{
      console.log("deleted !!!!")
      window.location.reload()
    })
  }
}
