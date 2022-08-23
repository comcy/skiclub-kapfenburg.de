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
      'https://script.google.com/macros/s/AKfycbz8msx1jgMo2BKnl_0QvQr-miR8l8NAtAeIf5DzjlpLYMx4onsmv7sgE7iPB8o-wkaFdQ/exec';

    // const request = new Request(url, {
    //   method: 'GET',
    //   body: '{"firstName": "bar", "lastName": "bar"}',
    // });

    // // const url = request.url;
    // const method = request.method;
    // const credentials = request.credentials;
    // const bodyUsed = request.bodyUsed;

    // const res = fetch(request);

    const res = await fetch(url, {
      // redirect: "follow",
      method: "POST",
      body: JSON.stringify(tripRegisterForm),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    console.log(res);

    return Promise.resolve(true);
  }
}
