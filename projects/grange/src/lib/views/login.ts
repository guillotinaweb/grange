import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../grange.service';
import { LoginInfo } from 'grange-core';
import { markForCheck } from 'develop/pastanaga-angular/projects/pastanaga/src/lib/common/utils';

@Component({
    selector: 'grange-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginView implements OnInit {
    useToken = false;
    error = '';
    isLogged: boolean;

    constructor(
        public grange: Grange,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.grange.core.auth.isAuthenticated.subscribe(auth => {
            this.isLogged = auth.state;
            markForCheck(this.cdr);
        });
    }

    onSubmit(data: LoginInfo | {token: string}) {
        this.error = '';
        if (!this.useToken) {
            const info = data as LoginInfo;
            this.grange.core.auth.login(info.login, info.password).subscribe(isLogged => {
                if (isLogged) {
                    this.grange.traverser.traverse('/');
                }
            });
        } else if (!!data['token']) {
            this.grange.core.auth.setAuthToken(data['token']);
            this.grange.traverser.traverse('/');
        }
    }
}
