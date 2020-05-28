import { Component, OnInit } from '@angular/core';
import { Grange } from '../../../../grange/src';

@Component({
    selector: 'app-player',
    templateUrl: 'player.component.html'
})
export class PlayerComponent implements OnInit {
    title = '';
    team = '';
    rank = 0;

    constructor(private grange: Grange) { }

    ngOnInit() {
        this.grange.getContext().subscribe(context => {
            this.title = context.title;
            this.team = context.team;
            this.rank = context.rank;
        });
    }

    save() {
        this.grange.updateContext({
            title: this.title,
            team: this.team,
            rank: this.rank,
        }).onComplete.subscribe(success => {
            if (success) {
                this.grange.ui.toaster.open('Saved', 2000);
                this.grange.traverser.traverse('/');
            } else {
                this.grange.ui.toaster.open('Error when saving.', 'common.dismiss');
            }
        });
    }
}
