import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../../grange.service';
import { LoginInfo } from '@guillotinaweb/grange-core';
import { markForCheck } from '@guillotinaweb/pastanaga-angular';

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
    title?: string;
    allowRegister = false;
    allowSocial = false;
    allowForgot = false;
    allowToken = false;
    providers = [];
    hasSocialLogin = false;

    constructor(
        public grange: Grange,
        private cdr: ChangeDetectorRef
    ) {
        this.allowForgot = true;
        this.allowToken = this.grange.core.config.get('ALLOW_TOKEN', false);
        this.hasSocialLogin = this.grange.core.config.get('SOCIAL_LOGIN', false);
    }

    ngOnInit() {
        this.grange.core.auth.getInfo().subscribe(
            res => {
                this.allowRegister = res.register;
                if (res.social !== undefined && res.social.length > 0) {
                    this.allowSocial = true;
                    this.providers = res.social;
                }
                this.title = res.title;
                markForCheck(this.cdr);
            }
        );
        this.grange.core.auth.isAuthenticated.subscribe(auth => {
            this.isLogged = auth.state;
            markForCheck(this.cdr);
        });
    }

    onRegister() {
        this.grange.traverser.traverse('/@@register');
    }

    onForgot() {
        this.grange.traverser.traverse('/@@forgot');
    }

    socialLogin(provider: string) {
        this.grange.core.auth.goSocialLogin(provider, '@@callback');
    }

    onSubmit(data: LoginInfo) {
        this.error = '';
        if (!this.useToken) {
            const info = data as LoginInfo;
            this.grange.core.auth.login(info.login, info.password).subscribe(isLogged => {
                if (isLogged) {
                    this.grange.traverser.traverse('/');
                }
            });
        } else if (!!data.token) {
            this.grange.core.auth.setAuthToken(data.token);
            this.grange.traverser.traverse('/');
        }
    }
}
