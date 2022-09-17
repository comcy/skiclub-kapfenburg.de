import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';

const SHEET_API_URL =
  // 'https://script.google.com/macros/s/AKfycbypcAH77zSIP7REyw2I2mnRUjIdutLquedGuGdlUzPMoIdBAwPBhHCMVq7dkkLpLJQf2w/exec';
  // 'https://sheetdb.io/api/v1/fdry4un53ccze'; // Sheet1;
  'https://sheetdb.io/api/v1/md2582mwb9jmk';

@Injectable()
export class CourseRegistrationFormService extends BaseRegistrationFormServiceInterface {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   *
   * @param courseRegisterForm
   */
  sendFormToSheetsIo(formData: FormData) {
    this.http.post(SHEET_API_URL, formData).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }
}
