import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export abstract class TripRegistrationFormServiceInterface {
  public abstract sendForm2(tripRegisterForm: any): void;
  public abstract sendForm(tripRegisterForm: any): Promise<void>;
}
