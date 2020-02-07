import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../grange.service';
import { LoginInfo } from 'grange-core';
import { ConfigurationService } from 'grange-core';
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
  title: string;
  allowRegister: boolean;
  allowSocial: boolean;
  allowForgot: boolean;
  allowToken: boolean;
  providers = [];

  constructor(
    public grange: Grange,
    protected config: ConfigurationService,
    private cdr: ChangeDetectorRef
  ) {
    this.allowForgot = true;
    this.allowToken = config.get('ALLOW_TOKEN', false);
  }

  ngOnInit() {
    this.grange.core.api.get('/@info').subscribe(
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
    const callUrl = this.config.get('BACKEND_URL') + '/@authenticate/' + provider + '?callback={{WEB_URL}}/@@callback/' + provider;
    window.location.href = callUrl;
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
