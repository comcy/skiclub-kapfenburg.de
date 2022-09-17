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
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /**
   *
   * @param courseRegisterForm
   */
  sendFormToSheetsIo(formData: FormData) {
    console.log('>>> https://sheetdb.io/api/v1/md2582mwb9jmk');
    this.http.post(SHEET_API_URL, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.snackBar.open('Test', 'Close');
      },
      error: (error) => console.log(error),
    });
  }
}
