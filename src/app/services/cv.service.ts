import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Subject } from "rxjs";

import { v4 as uuid } from "uuid";

import { Cv } from "./cv";
import { Section} from "./section"

@Injectable({
  providedIn: "root"
})
export class CvService {
  editing = false;
  private editingUpdated = new Subject<boolean>();

  public cvCreator
  public cvSections = [];
  private cvUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  getCv(username: string) {

    console.log(username)
    this.http
      .get<{ message: string, cv: Section[] }>("http://localhost:3000/api/cv/" + username)
      .subscribe(cvData => {
        console.log("getCV: "+cvData);
        if (cvData == null) {
          this.cvSections = [];
          this.cvUpdated.next([...this.cvSections]);
        } else {
          console.log("getCV else: "+cvData.cv)
          this.cvSections = cvData.cv;
          this.cvUpdated.next([...this.cvSections]);
          return this.cvSections
        }
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

    main.push(section.main);

    const newSection = {
      id: id,
      title: section.title,
      main: main
    };

    this.cvSections.push(newSection);

    this.http
      .put<{message: string; cv: Cv}>("http://localhost:3000/api/cv", {
        _id: localStorage.getItem("userId"),
        section: this.cvSections
      })
      .subscribe(response => {
        console.log(response.cv.section);
        this.cvUpdated.next([...this.cvSections]);
      });

    // this.cvUpdated.next([...this.cvSections]);
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

    this.cvUpdated.next([...this.cvSections]);
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

  clearCVData() {
    console.log(this.cvSections)
    this.cvSections = []
    this.cvCreator = null
    this.cvUpdated.next([...this.cvSections])
    console.log(this.cvSections)
  }
}
