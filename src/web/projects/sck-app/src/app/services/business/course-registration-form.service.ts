import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';

const SHEET_API_URL =
  // 'https://script.google.com/macros/s/AKfycbypcAH77zSIP7REyw2I2mnRUjIdutLquedGuGdlUzPMoIdBAwPBhHCMVq7dkkLpLJQf2w/exec';
  // 'https://sheetdb.io/api/v1/fdry4un53ccze'; // Sheet1;
  'https://sheetdb.io/api/v1/md2582mwb9jmk';

@Injectable()
export class CourseRegistrationFormService
  implements CourseRegistrationFormServiceInterface
{
  private successMessage: string =
    'Ihre Anghaben wurden übertragen. Bitte kontaktieren Sie uns telefonisch falls Sie in den nächsten 3 Tagen keine Bestätighung per Mail erhalten haben.';
  private errorMessage: string =
    'Beim Versand Ihrer Angaben ist ein Fehler aufgetreten. Bitte versuchen Sie es zu einem späteren Zeitpunkt noch einmal. Falls die Propbleme weiterhin bestehen nehmen Sie bitte telefonisch Kontakt mit uns auf.';
  private snackAction: string = 'Ok';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /**
   *
   * @param courseRegisterForm
   */
  sendFormToSheetsIo(formData: FormData) {
    this.http.post(SHEET_API_URL, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.snackBar.open(this.successMessage, this.snackAction);
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open(this.errorMessage, this.snackAction);
      },
    });
  }
}
