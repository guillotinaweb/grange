import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../../grange.service';
import { RecoverInfo } from 'grange-core';
import { markForCheck } from 'develop/pastanaga-angular/projects/pastanaga/src/lib/common/utils';

@Component({
  selector: 'grange-forgot',
  templateUrl: './forgot.html',
  styleUrls: ['./forgot.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotView implements OnInit {
  error = '';
  isLogged: boolean;
  title: string;

  constructor(
    public grange: Grange,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.grange.core.auth.isAuthenticated.subscribe(auth => {
      this.isLogged = auth.state;
      markForCheck(this.cdr);
    });
  }

  onSubmit(data: RecoverInfo) {
    this.error = '';
    this.grange.core.api.post('/@users/' + data.login + '/reset-password', {}).subscribe(
      res => {
        // TODO: add a message
        this.grange.traverser.traverse('/');
      },
      err => {
        this.error = err.response.error.reason;
        markForCheck(this.cdr);
      }
    );
  }
}
