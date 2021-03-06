import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit {

  currentDate: string;
  myTask = '';
  show : boolean = false;
  tasks = [];
  id : string;

  constructor(public angFireDb: AngularFireDatabase, public activatedRoute: ActivatedRoute,
    private angAuth : AngularFireAuth,
    private router: Router) {
      const date = new Date();
      this.currentDate = formatDate(date.toLocaleDateString(),'EEEE, yyyy/MM/dd','en-en');
    
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (p) => {
        console.log(p);
        
        this.id = p.get('id');
        this.getTasks();
      }
    )
    
  }



  addTask() {
    //console.log(this.myTask)
    console.log(this.id);
    
    this.angFireDb.list('Tasks/').push({
      userId : this.id,
      text : this.myTask,
      date : new Date().toISOString(),
      checked: false
    });
    //this.getTasks();
    this.myTask = '';
    this.ngOnInit();
  }

  showForm() {
    this.show = !this.show;
    this.myTask = '';
  }

  getTasks() {
    //this.tasks = [];
    this.angFireDb.list('Tasks/').snapshotChanges(['child_added', 'child_moved']).subscribe(
      (reponse) => {
        this.tasks = [];
        reponse.forEach(element => {
          console.log('** ' + element.payload.exportVal().text);
          if(element.payload.exportVal().userId == this.id && element.payload.exportVal().checked == true)
          this.tasks.push({
            key : element.key,
            text : element.payload.exportVal().text,
            date : element.payload.exportVal().date.substring(11, 16),
            checked : element.payload.exportVal().checked

          })
        })
      }
    );
    
    
  }

  changeCheckState(t) {
    console.log('checked: ' + t.checked);
    this.angFireDb.object('Tasks/' + t.key + '/checked/').set(t.checked);
    //this.ngOnInit();
    //this.getTasks();
  }

  deleteTask(t) {
    this.angFireDb.list('Tasks/').remove(t.key);
    this.ngOnInit();
    //this.getTasks();
  }

  logout() {
    this.angAuth.signOut().then(
      () => {
        localStorage.removeItem('mytoken');
        this.router.navigateByUrl("/");
      }
    );
    

  }


}
