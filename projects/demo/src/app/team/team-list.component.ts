import { Component } from '@angular/core';
import { map, concatMap } from 'rxjs/operators';
import { Grange } from '../../../../grange/src';
import { Resource } from '@guillotinaweb/grange-core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-teamlist',
    templateUrl: 'team-list.component.html'
})

export class TeamListComponent {
    newTeam = '';
    teams: Resource[];

    constructor(private grange: Grange) {
        this.loadTeams().subscribe(teams => this.teams = teams);
    }

    loadTeams(): Observable<Resource[]> {
        return this.grange.core.resource.items('/').pipe(
            map(res => res.items
                .filter(item => item['@type'] === 'team')
            )
        );
    }

    addTeam() {
        this.grange.addInContext({'@type': 'team', title: this.newTeam, contests: {}}).onComplete.pipe(
            concatMap(() => this.loadTeams()),
        ).subscribe(teams => {
            this.teams = teams;
            this.newTeam = '';
        });
    }

    delete(path: string) {
        this.grange.core.resource.delete(path).pipe(
            concatMap(() => this.loadTeams()),
        ).subscribe(teams => this.teams = teams);
    }
}
