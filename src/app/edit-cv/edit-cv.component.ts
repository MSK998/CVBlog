import { Component} from "@angular/core";

import { CvService } from "../services/cv.service";
import { AuthService } from "../auth/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit-cv",
  templateUrl: "./edit-cv.component.html",
  styleUrls: ["./edit-cv.component.css"],
})
export class EditCvComponent{
  public paramID: string;
  private userID: string;

  constructor(
    public cvService: CvService,
  ) {}

  editSections() {
    this.cvService.toggleEditing();
  }
}
