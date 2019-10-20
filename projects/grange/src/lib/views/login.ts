import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Grange } from '../grange.service';
import { LoginInfo } from 'grange-core';

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
    ) {}

    ngOnInit() {
        this.grange.core.auth.isAuthenticated.subscribe(auth => this.isLogged = auth.state);
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
