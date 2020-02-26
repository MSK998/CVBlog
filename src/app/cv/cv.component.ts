import { Component, OnDestroy, OnInit } from '@angular/core';
import { CvService } from '../services/cv.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})

export class CvComponent implements OnInit, OnDestroy{

  editState: boolean;
  private editSub: Subscription;

  constructor(private cvService: CvService){}

  ngOnInit() {
    this.editSub = this.cvService.getEditingUpdateListener().subscribe((editState: boolean) => {
      this.editState = editState;
      console.log(this.editState)
    });
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
  }


}
