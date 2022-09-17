import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseRegistrationFormServiceInterface } from '../base/base.interfaces';
import { COURSE_REGISTER_FORM_ELEMENTS } from './course-register-form-fields';

@Component({
  selector: 'lib-course-register-form',
  templateUrl: './course-register-form.component.html',
  styleUrls: ['./course-register-form.component.scss'],
})
export class CourseRegisterFormComponent implements OnInit {
  @Output() onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public sportTypeList = ['Ski Alpin', 'Snowboard'];
  public levelList = ['Anfänger', 'Könner', 'Fortgeschritten'];

  public courseRegisterForm: FormGroup = this.formBuilder.group({
    sportType: [null, [Validators.required]],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    age: [null, [Validators.required]],
    additionalText: [null, [Validators.required]],
    level: [null, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private courseRegistrationFormService: BaseRegistrationFormServiceInterface
  ) {}

  ngOnInit(): void {}

  public hasError(field: string): boolean {
    // TODO Generalize error messages
    // const foundField = this.tripRegisterFormElements.find((f) => {
    //   return field === f.id;
    // })?.validation;

    const emailError = this.courseRegisterForm
      .get(field)
      ?.hasError('email') as boolean;

    const requiredError = this.courseRegisterForm.get(field)?.value;

    return emailError && requiredError;
  }

  public isSubmitDisabled(): boolean {
    if (this.courseRegisterForm.valid) {
      return false;
    }
    return true;
  }

  public submit(): void {
    if (this.courseRegisterForm.valid) {
      const formData: FormData = new FormData();
      // Add form group data to form data
      for (let field of COURSE_REGISTER_FORM_ELEMENTS) {
        if (field.id === 'trip') {
          const tripValue = this.courseRegisterForm.get(field.id)?.value;
          formData.append('destination', tripValue.destination);
          formData.append('date', tripValue.date);
        }
        formData.append(field.id, this.courseRegisterForm.get(field.id)?.value);
      }

      if (formData) {
        this.onSubmit.emit(true);
        this.courseRegistrationFormService.sendFormToSheetsIo(formData);
      } else {
        console.error('No data provided');
      }
    }
  }
}
