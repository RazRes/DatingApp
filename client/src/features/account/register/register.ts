import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {


  cancelRegister = output<boolean>();
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  private fb = inject(FormBuilder);
  protected currentStep = signal(1)
  private router = inject(Router);
  protected validationErrors = signal<string[]>([]);
  private accountService = inject(AccountService);



  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.credentialsForm.controls['password'].valueChanges.subscribe({
      next: () => this.credentialsForm.controls['confirmPassword'].updateValueAndValidity()
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    }
  }

  nextStep(){
    if(this.credentialsForm.valid){
      this.currentStep.update(n => n + 1);
    }
  }

  prevStep(){
    this.currentStep.update(n => n - 1);
  }

  maxDate(){
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }


  register() {
    if(this.profileForm.valid && this.credentialsForm.valid){
      const formData = {...this.credentialsForm.value, ...this.profileForm.value};
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: error =>{
          console.log(error)
          this.validationErrors.set(error);
        }
      })
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
