import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CvService } from '../services/cv.service';
import { Cv } from '../services/cv';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})

export class CvComponent implements OnInit, OnDestroy{

  cv;
  private cvSub: Subscription;

  editState: boolean;
  private editSub: Subscription;

  constructor(private cvService: CvService){}

  ngOnInit() {
    this.cv = this.cvService.getCv();
    this.editSub = this.cvService.getEditingUpdateListener().subscribe((editState: boolean) => {
      this.editState = editState;
      console.log(this.editState)
    });

    this.cvSub = this.cvService.getCvUpdateListener().subscribe((cv: []) => {
      console.log(cv);
      this.cv = cv;
    });
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.cvSub.unsubscribe();
  }


}
