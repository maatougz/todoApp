import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router, ActivatedRoute } from '@angular/router';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  id : string;
  nb : number = 0;
  currentDate: string;
  constructor(public angFireDb: AngularFireDatabase,
    private activatedRoute : ActivatedRoute,
    private angAuth : AngularFireAuth) {
      const date = new Date();
      this.currentDate = formatDate(date.toLocaleDateString(),'EEEE, yyyy/MM/dd','en-en');
    
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (p) => {
        this.id = p.get('id');
      }
    );
    this.getTasks();
  }

  getTasks() {
    
    this.angFireDb.list('Tasks/').snapshotChanges(['child_added', 'child_moved']).subscribe(
      (reponse) => {
        reponse.forEach(element => {
          
          if(element.payload.exportVal().userId == this.id && element.payload.exportVal().checked == false)
            this.nb = this.nb + 1;
        })
      }
    );
    
    
  }


 
}
