import { HttpClient, HttpResponse } from '@angular/common/http';
import { BoundAttribute } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TripRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';

function setDefaultHeaders(): HeadersInit {
  return {
    // Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    // Accept: 'application/json',
  };
}

export const SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbypcAH77zSIP7REyw2I2mnRUjIdutLquedGuGdlUzPMoIdBAwPBhHCMVq7dkkLpLJQf2w/exec';
// 'https://sheetdb.io/api/v1/fdry4un53ccze'; // Sheet1
// 'https://sheetdb.io/api/v1/hf90pdiqf0sw4';

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
  sendFormToSheetsIo(tripRegisterForm: FormGroup) {
    var formData: any = new FormData();
    if (tripRegisterForm) {
      formData.append('firstName', tripRegisterForm.get('firstName')?.value);
      formData.append('lastName', tripRegisterForm.get('lastName')?.value);

      console.log('formdata ::: ', formData);

      this.http.post(SHEET_API_URL, formData);
      // .subscribe(
      // (res: any) => {
      //   console.log('### POST STATUS ### ', res);
      // }
      // {
      //   next: (response) => console.log(response),
      //   error: (error) => console.log(error),
      // }
      // );
    }
  }
}
