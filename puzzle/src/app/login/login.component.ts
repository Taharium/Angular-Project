import {Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    hide = true;
    arr : string[] = [];

    emailLogin = new FormControl('', [Validators.required, Validators.email]);
    passwordLogin = new FormControl('', [Validators.required, Validators.minLength(8)]);
    formBuilder = new FormBuilder();

    LoginForm = this.formBuilder.group({
        emailLogin : this.emailLogin,
        passwordLogin: this.passwordLogin,
    });

    errorMessageEmail() {
        if (this.emailLogin.hasError('required')) {
            return 'You must enter a value';
        }

        return this.emailLogin.hasError('email') ? 'Not a valid email' : '';
    }

    errorMessagePassword() {
        if (this.passwordLogin.hasError('required')) {
            return 'You must enter a value';
        }

        return this.passwordLogin.hasError('minlength') ? 'password should be at least 8 characters' : '';
    }
    onSubmit() {
        this.arr = [];
        if (this.emailLogin.valid && this.passwordLogin.valid) {
            for(let i  in this.LoginForm.value){
                this.arr.push(this.LoginForm.get(i)?.value);
            }
            console.log("Login successful");
        } else {
            console.log("Login failed");
        }
    }
}
