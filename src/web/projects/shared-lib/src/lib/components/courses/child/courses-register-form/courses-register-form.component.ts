import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserverService } from '../../../../services';
import { COURSE_REGISTER_FORM_ELEMENTS } from './courses-register-form-fields';
import { CoursesRegistrationFormServiceInterface } from './courses-register-form.interfaces';

@Component({
  selector: 'lib-courses-register-form',
  templateUrl: './courses-register-form.component.html',
  styleUrls: ['./courses-register-form.component.scss'],
})
export class CoursesRegisterFormComponent implements OnInit {
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
    private courseRegistrationFormService: CoursesRegistrationFormServiceInterface,
    public breakpointObserver: BreakpointObserverService
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
      const timestamp = Date.now();
      formData.append('timestamp', new Date(timestamp).toLocaleString());
      for (let field of COURSE_REGISTER_FORM_ELEMENTS) {
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