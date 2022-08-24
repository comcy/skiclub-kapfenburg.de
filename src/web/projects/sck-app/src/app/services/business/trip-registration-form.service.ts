import { HttpClient } from '@angular/common/http';
import { BoundAttribute } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TripRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';

function setDefaultHeaders(): HeadersInit {
  return {
    // Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

@Injectable({
  providedIn: 'root',
})
export class TripRegistrationFormService extends TripRegistrationFormServiceInterface {
  constructor(private http: HttpClient) {
    super();
  }

  public async sendForm(tripRegisterForm: FormGroup): Promise<boolean> {
    const url =
      'https://script.google.com/macros/s/AKfycbxlCykkXPGF-4SfF7W2rnx9GywydEQYZtTzYzcBMA8A9T63zfR3yLGkQBK0D9BWrDWNcA/exec';

    // const request = new Request(url, {
    //   method: 'GET',
    //   body: '{"firstName": "bar", "lastName": "bar"}',
    // });

    // // const url = request.url;
    // const method = request.method;
    // const credentials = request.credentials;
    // const bodyUsed = request.bodyUsed;

    // const res = fetch(request);

    console.log('>>> --- ', JSON.stringify(tripRegisterForm));

    console.log('>>> --- ', tripRegisterForm);

    const res = await fetch(url, {
      redirect: 'follow',
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({ vname: 'goood', nnane: 'baaaad' }),
      // headers: {
      //   'Content-Type': 'text/plain',
      // },
    })
      .then((response) => {
        console.log('success ::: ', response);
      })
      .catch((err) => {
        console.log('error ::: ', err);
      });

    console.log('>>>>> ', res);

    return Promise.resolve(true);
  }
}
