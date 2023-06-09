import { Component } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
    fakeHighscore = '';

    highscore = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    formBuilder = new FormBuilder();
    GameForm = this.formBuilder.group({
        highscore : this.highscore
    });

    constructor(private http: HttpClient, private router: Router) {}

    errorMessageHighscore() {
        if (this.highscore.hasError('required')) {
            return 'You must enter a value';
        }
        return this.highscore.hasError('pattern') ? 'Only numbers are accepted' : '';
    }

    getHighscore() {
        const authToken = localStorage.getItem('authToken');
        console.log(authToken);
        this.http.get('http://localhost:3000/highscores/'+authToken).subscribe({
            next:(res: any) => {
                console.log(res);
                this.fakeHighscore = res.highscore;
                //console.log("Highscore successfully retrieved");
            },
            error: (err: any) => {
                console.log(err.error);
            }
        });
    }

    logout() {
        const authToken = localStorage.getItem('authToken');

        this.http.delete('http://localhost:3000/sessions/'+authToken).subscribe({
            next: (res: any) => {
                localStorage.removeItem('authToken');
                console.log(res);
                this.router.navigate(['/']).then(r => console.log(r));
            },
            error: (err: any) => {
                console.log(err.error);
            }
        });
    }

    onSubmit() {
        this.fakeHighscore = '';
        if (this.highscore.valid) {
            const authToken = localStorage.getItem('authToken');
            let json = {
                highscore : this.highscore.value
            }
            this.http.post('http://localhost:3000/highscores/'+authToken, json).subscribe({
                next: (res: any) => {
                    console.log(res);
                },
                error: (err: any) => {
                    console.log(err.error);
                }
            });
        } else {
            console.log("Invalid input");
        }
    }
}
