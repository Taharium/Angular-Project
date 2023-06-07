import {Component} from '@angular/core';
import {Router} from "@angular/router";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'FHTW Puzzle Game';
    strApp = '';
    constructor(private router: Router) {}

    checkAuthToken() {
        if (localStorage.getItem('authToken') !== null) {
            this.strApp = '';
            this.router.navigate(['/game']).then(r => console.log(r));
        } else {
            this.router.navigate(['/']).then(r => console.log(r));
            this.strApp = 'Please Login to play the game';
            setTimeout(() => {
                this.strApp = '';
            }, 2000);
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
