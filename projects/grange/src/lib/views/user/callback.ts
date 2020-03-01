import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../../grange.service';
import { markForCheck } from '@guillotinaweb/pastanaga-angular';

@Component({
  selector: 'grange-callback',
  templateUrl: './callback.html',
  styleUrls: ['./callback.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackView implements OnInit {
  // Social callback call to validate social login
  // Comes from API with credentials to login

  error = '';
  isLogged: boolean;
  token?: string;

  constructor(
    public grange: Grange,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.grange.core.auth.isAuthenticated.subscribe(auth => {
      this.isLogged = auth.state;
      markForCheck(this.cdr);
    });

    this.grange.traverser.target.subscribe(
      res => {
        if (res.query) {
          this.token = res.query.get('token');
        }
      }
    );
    this.grange.core.auth.setAuthToken(this.token);
    this.grange.traverser.traverse('/');
  }
}
