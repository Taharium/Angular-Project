import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'FHTW Puzzle Game';
    strApp = '';

    constructor(private http: HttpClient, private router: Router) {}

    checkAuthToken() {
        if (localStorage.getItem('authToken') !== null) {
            this.http.get('http://localhost:3000/sessions/'+localStorage.getItem('authToken')).subscribe({
                next: (res:any) =>  {
                    console.log(res);
                    this.router.navigate(['/game']).then(r => console.log(r));
                },
                error: (err:any) =>  {
                    console.log(err.error);
                    this.router.navigate(['/']).then(r => console.log(r));
                    this.strApp = 'Invalid Token, Please Login to play the game';
                }
            });
        } else {
            this.router.navigate(['/']).then(r => console.log(r));
            this.strApp = 'Please Login to play the game';
        }
    }

    login() {
        this.strApp = '';
        this.router.navigate(['/login']).then(r => console.log(r));
    }

    signup() {
        this.strApp = '';
        this.router.navigate(['/signup']).then(r => console.log(r));
    }
}
