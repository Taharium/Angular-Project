import {Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
    //providers: [LoginService]
})
export class LoginComponent {
    hide = true;
    arr : string[] = [];
    str = '';

    emailLogin = new FormControl('', [Validators.required, Validators.email]);
    passwordLogin = new FormControl('', [Validators.required, Validators.minLength(8)]);
    formBuilder = new FormBuilder();

    LoginForm = this.formBuilder.group({
        emailLogin : this.emailLogin,
        passwordLogin: this.passwordLogin,
    });

    constructor(private http: HttpClient, private router: Router) {}

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
        this.str = '';
        if (this.emailLogin.valid && this.passwordLogin.valid) {

            for(let i  in this.LoginForm.value){
                this.arr.push(this.LoginForm.get(i)?.value);
            }

            let json = {
                username : this.emailLogin.value,
                password: this.passwordLogin.value
            }

            this.http.post('http://localhost:3000/login', json).subscribe((res: any) => {
                console.log(res.text);
                console.log("Login successful");
                localStorage.setItem('authToken', res.authToken);
                setTimeout(() => {
                    this.router.navigate(['/']).then(r => console.log(r));
                }, 2000);
            });

        } else {
            this.str = "Invalid input";
            console.log("Login failed");
        }
    }
}
