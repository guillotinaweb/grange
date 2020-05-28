import { Component, OnInit } from '@angular/core';
import { Grange } from '../../../../grange/src';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-canvas',
    templateUrl: 'canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
})

export class CanvasComponent implements OnInit {
    points = this.grange.getContext().pipe(
        tap(context => {
            this.path = context['@id'];
        }),
        map(context => context.points || {}),
    );
    canvas: Observable<boolean[][]> = this.points.pipe(
        map((points: {[coord: string]: boolean}) => Object.entries(points).reduce((all, [coordStr, value]) => {
                const coord = coordStr.split('-').map(x => parseInt(x, 10));
                all[coord[0]][coord[1]] = value;
                return all;
            }, Array.from(new Array(10), x => Array.from(new Array(10), () => false)))
        ),
    );
    path?: string;

    constructor(private grange: Grange) { }

    ngOnInit() {}

    toggle(x: number, y: number, current: boolean) {
        const coord = `${x}-${y}`;
        return this.grange.updateContext({points: {[coord]: !current}});
    }
}
