import { Component } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
    hide = true;
    hide2 = true;
    arr : string[] = [];
    finished = true;
    str = '';

    company = new FormControl('FH Technikum Wien', [Validators.required, Validators.pattern('FH Technikum Wien')]);
    street = new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZÜüÖöÄäß]*')]);
    city = new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZÜüÖöÄäß]*')]);
    postal = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]);
    email = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    confpassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
    formBuilder = new FormBuilder();

    LoginForm = this.formBuilder.group({
        company : this.company,
        street: this.street,
        city: this.city,
        postal: this.postal,
        email : this.email,
        password: this.password,
        confpassword: this.confpassword
    });



    constructor(private http: HttpClient, private router: Router) {}

    errorMessageCompany() {
        if (this.company.hasError('required')) {
            return 'You must enter a value';
        }
        return this.company.hasError('pattern') ? 'Only FH Technikum Wien is accepted' : '';
    }

    errorMessageStreet() {
        if (this.street.hasError('required')) {
            return 'You must enter a value';
        }
        return this.street.hasError('pattern') ? 'Only letters are accepted' : '';
    }

    errorMessageCity() {
        if (this.city.hasError('required')) {
            return 'You must enter a value';
        }
        return this.city.hasError('pattern') ? 'Only letters are accepted' : '';
    }

    errorMessagePostal() {
        if (this.postal.hasError('required')) {
            return 'You must enter a value';
        }
        if(this.postal.hasError('minlength') || this.postal.hasError('maxlength')){
            return 'Postal code should be 4 digits';
        }
        return this.postal.hasError('pattern') ? 'Only numbers are accepted' : '';
    }

    errorMessageEmail() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }
        return this.email.hasError('email') ? 'Not a valid email' : '';
    }

    errorMessagePassword() {
        if (this.password.hasError('required')) {
            return 'You must enter a value';
        }
        return this.password.hasError('minlength') ? 'password should be at least 8 characters' : '';
    }

    errorMessagePasswordconfirm() {
        if (this.confpassword.hasError('required')) {
            return 'You must enter a value';
        }
        return this.confpassword.hasError('minlength') ? 'password should be at least 8 characters' : '';
    }
    comparePassword() {
        if (this.password.value != this.confpassword.value && this.password.valid && this.confpassword.valid){
            return 'passwords do not match';
        }
        return '';
    }

    formNotValid() {
        if(this.str != '') {
            return this.str;
        }
        return this.str;
    }

    formValid() {
        return this.password.value == this.confpassword.value && this.password.valid && this.confpassword.valid
            && this.company.valid && this.street.valid && this.city.valid && this.postal.valid && this.email.valid;
    }

    onSubmit() {
        this.arr = [];
        this.str = '';
        if(this.formValid()) {
            for(let i  in this.LoginForm.value){
                this.arr.push(this.LoginForm.get(i)?.value);
            }

            let json = {
                company: this.company.value,
                street: this.street.value,
                city: this.city.value,
                postal: this.postal.value,
                username : this.email.value,
                password: this.password.value
            }

            this.http.post('http://localhost:3000/users', json).subscribe({
                next: (res: any) => {
                    console.log(res);
                    localStorage.setItem('authToken', res.authToken);
                    setTimeout(() => {
                        this.router.navigate(['/game']).then(r => console.log(r));
                    }, 2000);
                },
                error: (err: any) => {
                    console.log(err.error);
                }
            });
        } else {
            this.str = 'Please fill out all fields correctly';
        }
    }
}
