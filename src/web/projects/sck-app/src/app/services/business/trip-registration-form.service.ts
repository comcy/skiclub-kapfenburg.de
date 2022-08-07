import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TripRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';

@Injectable({
  providedIn: 'root',
})
export class TripRegistrationFormService extends TripRegistrationFormServiceInterface {
  constructor() {
    super();
  }

  public sendForm(tripRegisterForm: FormGroup): Promise<boolean> {
    console.log('FORM ::: ', tripRegisterForm);
    return Promise.resolve<boolean>(true);
  }
}
