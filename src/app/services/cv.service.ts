import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { v4 as uuid } from 'uuid';

import { Cv } from './cv';
import { CV } from './test-cv';
import { MatInkBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class CvService {

  editing = false;
  private editingUpdated = new Subject<boolean>();
  private cvId = CV._id;
  private cv = CV.section;
  private cvUpdated = new Subject<any>();

  constructor() {

  }

  getCv() {
    console.log([...this.cv]);
    this.cvUpdated.next([...this.cv]);
    return [...this.cv];
  }

  getCvUpdateListener() {
    console.log([...this.cv]);
    return this.cvUpdated.asObservable();
  }

  getEditingUpdateListener() {
    return this.editingUpdated.asObservable();
  }

  addSection(section) {
    const id = uuid();

    const main = [];

    main.push(section.main)

    const newSection = {
      id: id,
      title: section.title,
      main: main
    }

    this.cv.push(newSection);

    console.log(this.cv)

    this.cvUpdated.next([...this.cv]);
  }

  removeSection(sectionId) {

    const index = this.cv.findIndex(x => x.id === sectionId);

    this.cv.splice(index, 1);

    this.cvUpdated.next([...this.cv]);
  }

  editSection(section) {
    const index = this.cv.findIndex(x => x.id === section);

    this.cv[index].title = section.title;
    this.cv[index].main = section.main;
  }

  toggleEditing() {
    if (this.editing) {
      this.editing = false;
      this.editingUpdated.next(false);
    } else {
      this.editing = true;
      this.editingUpdated.next(true);
    }
  }

  getIsEditing() {
    return this.editing;
  }
}
