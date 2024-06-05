import {Component} from '@angular/core';
import {MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-advertisement-snackbar',
  templateUrl: './advertisement-snackbar.component.html',
  styleUrls: ['./advertisement-snackbar.component.css']
})
export class AdvertisementSnackbarComponent {
  constructor(private readonly snackBarRef: MatSnackBarRef<AdvertisementSnackbarComponent>) {
  }

  clickOnCloseButton() {
    this.snackBarRef.dismiss();
  }
}
