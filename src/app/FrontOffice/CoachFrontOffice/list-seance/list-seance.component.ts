import { Component, OnInit } from '@angular/core';
import { CoatchService } from 'src/app/services/serviceCoatch/coatch.service';
import { seance } from 'src/core/models/seance';

@Component({
  selector: 'app-list-seance',
  templateUrl: './list-seance.component.html',
  styleUrls: ['./list-seance.component.css']
})
export class ListSeanceComponent implements OnInit {


     seance: seance[] = [];
    
      constructor(private coatchService: CoatchService) {}
    
      ngOnInit(): void {
        this.getSeances();
      }
    
      getSeances(): void {
        this.coatchService.getAllSeances().subscribe(data => {
          this.seance = data;
        });
      }
  
  
      deleteSeances(id:any){
        this.coatchService.delSeances(id).subscribe(()=>{
          console.log("deleted session !!!!")
          window.location.reload()
        })
      }
  
  }
  

