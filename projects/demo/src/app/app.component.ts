import { Component } from '@angular/core';
import { GrangeViews, Grange } from '../../../grange/src';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isAuthenticated = false;
    constructor(
        private grange: Grange,
        private views: GrangeViews,
    ) {
        this.views.initialize();
        this.grange.core.auth.isAuthenticated.subscribe(auth => this.isAuthenticated = auth.state);
        this.grange.traverser.addView('view', 'canvas', CanvasComponent);
    }

    logout() {
        this.grange.core.auth.logout();
    }
}
