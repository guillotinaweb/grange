import { OnDestroy } from '@angular/core';
import { Grange } from '../grange.service';
import { ConfigurationService } from 'grange-core';


import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { markForCheck } from 'pastanaga-angular';

@Component({
  selector: 'grange-auth',
  templateUrl: './base-auth.html',
  styleUrls: ['./base-auth.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseAuthComponent implements OnInit {
    isLogged: boolean;
    logo?: string;

    constructor(
        public grange: Grange,
        protected config: ConfigurationService,
        private cdr: ChangeDetectorRef
    ) {
      this.logo = this.config.get('LOGO', 'https://raw.githubusercontent.com/guillotinaweb/gigi/master/src/assets/logo.svg');
    }

    ngOnInit() {
        this.grange.core.auth.isAuthenticated.subscribe(auth => {
            this.isLogged = auth.state;
            markForCheck(this.cdr);
        });
    }
}
