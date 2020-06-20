import { Grange } from '../grange.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { markForCheck } from '@guillotinaweb/pastanaga-angular';

@Component({
    selector: 'grange-auth',
    templateUrl: './base-auth.html',
    styleUrls: ['./base-auth.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseAuthComponent implements OnInit {
    logo?: string;

    constructor(
        public grange: Grange,
        private cdr: ChangeDetectorRef
    ) {
        this.logo = this.grange.core.config.get('LOGO');
    }

    ngOnInit() {
        this.grange.core.auth.isAuthenticated.subscribe(auth => {
            markForCheck(this.cdr);
        });
    }
}
