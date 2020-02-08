import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../../grange.service';
import { markForCheck } from 'pastanaga-angular';

@Component({
  selector: 'grange-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterView implements OnInit {
  error = '';
  isLogged: boolean;
  schema?: any;
  editModel?: any;

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

  onSubmit(data: any) {
    this.error = '';
  }
}
