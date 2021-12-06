import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

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
    
    console.log(this.id);
    
    this.angFireDb.list('Tasks/').push({
      userId : this.id,
      text : this.myTask,
      date : new Date().toISOString(),
      checked: false
    });
    
    this.myTask = '';
    this.ngOnInit();
  }

  showForm() {
    this.show = !this.show;
    this.myTask = '';
  }

  getTasks() {
    
    this.angFireDb.list('Tasks/').snapshotChanges(['child_added', 'child_moved']).subscribe(
      (reponse) => {
        this.tasks = [];
        reponse.forEach(element => {
          console.log('** ' + element.payload.exportVal().text);
          if(element.payload.exportVal().userId == this.id)
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
    
  }

  deleteTask(t) {
    this.angFireDb.list('Tasks/').remove(t.key);
    this.ngOnInit();
    
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
