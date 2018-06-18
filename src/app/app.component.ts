import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    private callMapScript: Subscription;
    private calljs: Subscription;
    public profile: boolean;

    constructor(private router: Router) {
        this.profile = false;
    }

    ngOnInit() {
        this.router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                window.scrollTo(0, 0);
                this.calljs = Observable.interval(200).subscribe((val) => {
                    var scriptCall = document.getElementById('scriptCall');
                    scriptCall.click();
                    this.calljs.unsubscribe();
                });
                if (event.url.includes('restaurants/') || event.url.includes('hotels/') || event.url.includes('contact')) {
                    this.callMapScript = Observable.interval(500).subscribe((val) => {
                        var loadMap = document.getElementById('loadMap');
                        loadMap.click();
                        this.callMapScript.unsubscribe();
                    });
                }
                if (event.url.includes('profile/')) {
                    document.getElementById("header-container").classList.add("fixed", "fullwidth", "dashboard");
                    document.getElementById("header").classList.add("not-sticky");
                    document.getElementById("logo").getElementsByTagName("a")[0].classList.add("dashboard-logo");
                    document.getElementById("logo").getElementsByTagName("img")[0].src = "assets/images/logo2.png";
                    this.profile = true;
                }
                if (!event.url.includes('profile/')) {
                    document.getElementById("header-container").classList.remove("fixed", "fullwidth", "dashboard");
                    document.getElementById("header").classList.remove("not-sticky");
                    document.getElementById("logo").getElementsByTagName("a")[0].classList.remove("dashboard-logo");
                    document.getElementById("logo").getElementsByTagName("img")[0].src = "assets/images/logo.png";
                    this.profile = false;
                }
            }
        });
    }
}
