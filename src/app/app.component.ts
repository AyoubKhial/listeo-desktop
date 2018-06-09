import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    private callMapScript: Subscription;

    private calljs: Subscription;
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                window.scrollTo(0, 0);
                this.calljs = Observable.interval(200).subscribe((val) => {
                    var scriptCall = document.getElementById('scriptCall');
                    scriptCall.click();
                    this.calljs.unsubscribe();
                    
                });
                if (event.url.includes('restaurants/')) {
                    this.callMapScript = Observable.interval(500).subscribe((val) => {
                        var loadMap = document.getElementById('loadMap');
                        loadMap.click();
                        this.callMapScript.unsubscribe();
                    });
                }
            }
            // NavigationEnd
            // NavigationCancel
            // NavigationError
            // RoutesRecognized
        });

    }
}
