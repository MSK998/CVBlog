import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { Cv } from './cv';

@Injectable({
  providedIn: 'root'
})

export class CvService {

  private cv = [];
  private cvUpdated = new Subject<Cv[]>();

  constructor (private http: HttpClient) {

  }

  getCv() {
    return [...this.cv];
  }

  getCvUpdateListener() {
    return this.cvUpdated.asObservable();
  }

  addSection(section) {

    const newSection = {section: section};

    this.cv.push(newSection);

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
    this.cv[index].main = section.main
  }
}
