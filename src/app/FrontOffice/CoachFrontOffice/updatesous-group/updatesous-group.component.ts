import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CoatchService } from 'src/app/services/serviceCoatch/coatch.service';

@Component({
  selector: 'app-updatesous-group',
  templateUrl: './updatesous-group.component.html',
  styleUrls: ['./updatesous-group.component.css']
})
export class UpdatesousGroupComponent implements OnInit {

  idurl:any
  constructor(private act:ActivatedRoute, private sousgrpService: CoatchService , private router:Router){ }
  ngOnInit(): void {
    this.idurl= this.act.snapshot.params['idSousGroup']
  }
}
