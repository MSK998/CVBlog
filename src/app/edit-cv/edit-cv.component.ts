import { Component } from '@angular/core';

import { CvService } from '../services/cv.service';

@Component({
  selector: 'app-edit-cv',
  templateUrl: './edit-cv.component.html',
  styleUrls: ['./edit-cv.component.css']
})

export class EditCvComponent{


  constructor(public cvService: CvService) {

  }

  editSections() {
    this.cvService.toggleEditing()
    console.log(this.cvService.getIsEditing());
    console.log(this.cvService.getEditingUpdateListener())
  }
}
