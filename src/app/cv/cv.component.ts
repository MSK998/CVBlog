import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { CvService } from "../services/cv.service";
import { Cv } from "../services/cv";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService } from "../auth/auth.service";
import { HttpParams } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

export interface DialogData {
  title: string;
  main: string;
}

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent implements OnInit, OnDestroy {
  public cvSections: any[];
  private cvSub: Subscription;

  editState: boolean;
  private editSub: Subscription;

  isLoading = false;
  isEmpty = true;
  userId: string;
  username: string;

  public paramId: string;

  constructor(
    private authService: AuthService,
    private cvService: CvService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.editSub = this.cvService
      .getEditingUpdateListener()
      .subscribe((editState: boolean) => {
        this.editState = editState;
        console.log(this.editState);
      });

    this.username = this.authService.getUsername();
    this.paramId = this.route.snapshot.paramMap.get("creator");

    console.log("ParamID:" + this.paramId);

    this.isLoading = true;

    this.cvSections = this.cvService.getCv(this.paramId);
    console.log("CV COMPONENT: " + this.cvSections);
    this.cvSub = this.cvService
      .getCvUpdateListener()
      .subscribe((cvSection: any[]) => {
        this.cvSections = cvSection;
        if (this.cvSections.length) {
          this.isEmpty = false;
        }
        this.isLoading = false;
        console.log("CV COMPONENT SUB: " + this.cvSections);
      });
  }

  ngOnDestroy() {
    this.editSub.unsubscribe();
    this.cvSub.unsubscribe();
  }

  openAddSection() {
    this.dialog.open(AddSectionDialog, {
      width: "800px",
      data: {},
    });
  }

  openEditSection(idToEdit) {
    const index = this.cvSections.findIndex((x) => x.id === idToEdit);

    const dialogRef = this.dialog.open(EditSectionDialog, {
      width: "800px",
      data: {
        id: this.cvSections[index].id,
        title: this.cvSections[index].title,
        main: this.cvSections[index].main,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cvService.editSection(
        this.cvSections[index].id,
        result.title,
        result.main
      );
    });
  }

  deleteSection(idToDelete) {
    const index = this.cvSections.findIndex((x) => x.id === idToDelete);

    const dialogRef = this.dialog.open(DeleteSectionDialog, {
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cvService.removeSection(this.cvSections[index].id);
    });
  }
}

@Component({
  selector: "app-add-section-dialog",
  templateUrl: "./add-section.component.html",
  styleUrls: ["./add-section.component.css"],
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
      main: form.value.sectionMain,
    };

    this.cvService.addSection(section);
  }
}

@Component({
  selector: "app-edit-dialog",
  templateUrl: "./edit-section.component.html",
  styleUrls: [],
})
export class EditSectionDialog {
  constructor(
    public dialogRef: MatDialogRef<EditSectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-delete-dialog",
  templateUrl: "./delete-section.component.html",
  styleUrls: [],
})
export class DeleteSectionDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteSectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
