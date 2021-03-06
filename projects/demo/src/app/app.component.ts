import { Component } from '@angular/core';
import { GrangeViews, Grange } from '../../../grange/src';
import { PlayerComponent } from './player/player.component';
import { TeamComponent } from './team/team.component';
import { TeamListComponent } from './team/team-list.component';
import { TeamContestsComponent } from './team/team-contests.component';

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
        this.grange.traverser.addView('view', 'Container', TeamListComponent);
        this.grange.traverser.addView('edit', 'player', PlayerComponent);
        this.grange.traverser.addView('view', 'team', TeamComponent);
        this.grange.traverser.addView('contests', 'team', TeamContestsComponent);
    }

    logout() {
        this.grange.core.auth.logout();
    }
}
