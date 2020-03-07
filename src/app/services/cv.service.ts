import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { v4 as uuid } from 'uuid';

import { Cv } from './cv';
// import { CV } from './test-cv';
import { MatInkBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class CvService {

  editing = false;
  private editingUpdated = new Subject<boolean>();

  public cvId: string;
  public cvSections: any[] = [];
  private cvUpdated = new Subject<any>();

  constructor(private http: HttpClient) {

  }

  getCv() {

    this.http.get<{ message: string; cv: Cv}>(
      'http://localhost:3000/api/cv'
    ).subscribe(cvData => {
      console.log(cvData);
      this.cvId = cvData.cv._id
      this.cvSections = cvData.cv.section
      this.cvUpdated.next([...this.cvSections])
    });

    return [...this.cvSections];
  }

  getCvUpdateListener() {
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

    this.cvSections.push(newSection);

    this.cvUpdated.next([...this.cvSections]);
  }

  removeSection(sectionId) {

    const index = this.cvSections.findIndex(x => x.id === sectionId);

    this.cvSections.splice(index, 1);

    this.cvUpdated.next([...this.cvSections]);
  }

  editSection(section) {
    const index = this.cvSections.findIndex(x => x.id === section);

    this.cvSections[index].title = section.title;
    this.cvSections[index].main = section.main;
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
