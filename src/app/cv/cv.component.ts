import {
  Component,
  OnDestroy,
  OnInit,
  Inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { CvService } from '../services/cv.service';
import { Cv } from '../services/cv';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})

export class CvComponent implements OnInit, OnDestroy {

  cv;
  private cvSub: Subscription;

  editState: boolean;
  private editSub: Subscription;

  constructor(private cvService: CvService) { }

  ngOnInit() {
    this.cv = this.cvService.getCv();
    this.editSub = this.cvService.getEditingUpdateListener()
      .subscribe((editState: boolean) => {
        this.editState = editState;
        console.log(this.editState);
      });

    this.cvSub = this.cvService.getCvUpdateListener()
      .subscribe((cv: []) => {
        console.log(cv);
        this.cv = cv;
      });
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.cvSub.unsubscribe();
  }
}

@Component({
  selector: 'app-add-section-dialog',
  templateUrl: './add-section.component.html'
})

export class AddSectionDialog {

  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AddSectionDialog>,
    private cvService: CvService
  ) { }

  addSection(form: NgForm): void {
    const section = {
      title: "test",
      main: [],
    };
  }
}
