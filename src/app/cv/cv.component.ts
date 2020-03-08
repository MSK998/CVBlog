import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  ViewEncapsulation
} from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { CvService } from "../services/cv.service";
import { Cv } from "../services/cv";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";

export interface DialogData {
  title: string;
  main: string;
}

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"]
})
export class CvComponent implements OnInit, OnDestroy {
  public cvSections: any[];
  private cvSub: Subscription;

  editState: boolean;
  private editSub: Subscription;

  isLoading = false;
  isEmpty = true;

  constructor(private cvService: CvService, public dialog: MatDialog) {}

  ngOnInit() {
    this.editSub = this.cvService
      .getEditingUpdateListener()
      .subscribe((editState: boolean) => {
        this.editState = editState;
        console.log(this.editState);
      });

    this.isLoading = true;
    this.cvSections = this.cvService.getCv();
    console.log(this.cvSections);
    this.cvSub = this.cvService
      .getCvUpdateListener()
      .subscribe((cvSection: any[]) => {
        this.cvSections = cvSection;
        if(this.cvSections.length){
          this.isEmpty = false
        }
        this.isLoading = false;
        console.log(this.cvSections);
      });
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.cvSub.unsubscribe();
  }

  openAddSection() {
    this.dialog.open(AddSectionDialog, {
      width: "800px",
      data: {}
    });
  }
}

@Component({
  selector: "app-add-section-dialog",
  templateUrl: "./add-section.component.html",
  styleUrls: ["./add-section.component.css"]
})
export class AddSectionDialog {
  isLoading = false;
  isChecked = false;

  constructor(
    public dialogRef: MatDialogRef<AddSectionDialog>,
    private cvService: CvService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  addSection(form: NgForm): void {
    const section = {
      title: form.value.sectionTitle,
      main: form.value.sectionMain
    };

    this.cvService.addSection(section);
  }
}
