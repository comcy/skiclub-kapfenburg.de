import { HttpClient } from '@angular/common/http';
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

const SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbzhxiXUCV-iV6GjtyzDQHm5PA6n7l0gpxZPeC4ueTyGTax_EoQVaQeOwjhIXzRk4JoMww/exec';
// 'https://sheetdb.io/api/v1/fdry4un53ccze';

@Injectable({
  providedIn: 'root',
})
export class TripRegistrationFormService extends TripRegistrationFormServiceInterface {
  constructor(private http: HttpClient) {
    super();
  }

  public requestFormData!: FormData;

  public async sendForm(tripRegisterForm: FormGroup): Promise<void> {
    console.log('form group ::: ', tripRegisterForm);
    var formData: any = new FormData();
    formData.append('firstName', tripRegisterForm.get('firstName')?.value);
    formData.append('lastName', tripRegisterForm.get('lastName')?.value);

    console.log('formdata ::: ', formData);
    const res = await fetch(SHEET_API_URL, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log('success ::: ', response);
      })
      .catch((err) => {
        console.log('error ::: ', err);
      });

    console.log('>>>>> ', res);

    // return Promise.resolve(true);
  }

  sendForm2(tripRegisterForm: FormGroup) {
    console.log('form group ::: ', tripRegisterForm);
    var formData: any = new FormData();
    if (tripRegisterForm) {
      formData.append('firstName', tripRegisterForm.get('firstName')?.value);
      formData.append('lastName', tripRegisterForm.get('lastName')?.value);

      console.log('formdata ::: ', formData);

      this.http.post(SHEET_API_URL, formData).subscribe({
        next: (response) => console.log(response),
        error: (error) => console.log(error),
      });
    }
  }
}
