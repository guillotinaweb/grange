import { Component } from '@angular/core';
import { ViewView } from '../../../../grange/src';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-team-contests',
    templateUrl: 'team-contests.component.html',
})
export class TeamContestsComponent extends ViewView {
    year = '';
    victory = false;

    contests = this.context.pipe(
        map(context => Object.entries(context['contests'] || {}))
    );

    addContest() {
        this.grange.updateContext({contests: {[this.year]: this.victory}});
        this.year = '';
        this.victory = false;
    }
}
