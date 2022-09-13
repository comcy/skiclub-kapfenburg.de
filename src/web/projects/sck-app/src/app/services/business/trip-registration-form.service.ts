import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TripRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';

export const SHEET_API_URL =
  // 'https://script.google.com/macros/s/AKfycbypcAH77zSIP7REyw2I2mnRUjIdutLquedGuGdlUzPMoIdBAwPBhHCMVq7dkkLpLJQf2w/exec';
  // 'https://sheetdb.io/api/v1/fdry4un53ccze'; // Sheet1
  'https://sheetdb.io/api/v1/hf90pdiqf0sw4';

@Injectable({
  providedIn: 'root',
})
export class TripRegistrationFormService extends TripRegistrationFormServiceInterface {
  constructor(private http: HttpClient) {
    super();
  }

  public requestFormData!: FormData;

  /**
   *
   * @param tripRegisterForm
   */
  public async sendFormToGoogleSheet(
    tripRegisterForm: FormGroup
  ): Promise<void> {
    var formData: any = new FormData();
    formData.append('firstName', tripRegisterForm.get('firstName')?.value);
    formData.append('lastName', tripRegisterForm.get('lastName')?.value);
    formData.append('email', tripRegisterForm.get('email')?.value);
    formData.append('phone', tripRegisterForm.get('phone')?.value);
    formData.append('amount', tripRegisterForm.get('amount')?.value);

    console.log('FORM DATA ', formData);

    await fetch(SHEET_API_URL, {
      redirect: 'follow',
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log('success ::: ', response);
      })
      .catch((err) => {
        console.log('error ::: ', err);
      });
  }

  /**
   *
   * @param tripRegisterForm
   */
  sendFormToSheetsIo(formData: FormData) {
    this.http.post(SHEET_API_URL, formData).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }
}
