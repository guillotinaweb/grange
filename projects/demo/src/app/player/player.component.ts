import { Component, OnInit } from '@angular/core';
import { BaseView } from '../../../../grange/src';
import { Resource } from '@guillotinaweb/grange-core';
import { map } from 'rxjs/operators';
import { MovePlayerComponent } from './move-player.dialog';

interface Player extends Resource {
    rank: number;
}

@Component({
    selector: 'app-player',
    templateUrl: 'player.component.html'
})
export class PlayerComponent extends BaseView implements OnInit {
    title = '';
    rank = 0;
    player = this.context.pipe(map(res => res as Player));

    ngOnInit() {
        this.player.subscribe(player => {
            this.title = player.title;
            this.rank = player.rank;
        });
    }

    save() {
        this.grange.updateContext({
            title: this.title,
            rank: this.rank,
        }).onComplete.subscribe(success => {
            if (success) {
                this.grange.ui.toaster.open('Updated', 2000);
                this.grange.traverser.traverse('..');
            } else {
                this.grange.ui.toaster.open('Error when saving.', 'common.dismiss');
            }
        });
    }

    delete() {
        this.grange.deleteContext().onComplete.subscribe(success => {
            if (success) {
                this.grange.traverser.traverse('..');
            }
        });
    }

    openDialog() {
        this.grange.ui.dialog.openDialog(MovePlayerComponent).onClose.subscribe(teamPath => {
            if (!!teamPath) {
                this.grange.traverser.traverse(teamPath);
            }
        });
    }
}
