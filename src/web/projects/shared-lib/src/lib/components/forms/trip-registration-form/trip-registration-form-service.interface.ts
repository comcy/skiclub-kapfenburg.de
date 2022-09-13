import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export abstract class TripRegistrationFormServiceInterface {
  public abstract sendFormToSheetsIo(formData: FormData): void;
  public abstract sendFormToGoogleSheet(tripRegisterForm: any): Promise<void>;
}
