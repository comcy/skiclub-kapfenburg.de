import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class CourseRegistrationFormServiceInterface {
  public abstract sendFormToSheetsIo(formData: FormData): void;
}
