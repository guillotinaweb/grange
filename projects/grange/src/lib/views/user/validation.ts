import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../../grange.service';
import { markForCheck } from 'pastanaga-angular';

@Component({
  selector: 'grange-validation',
  templateUrl: './validation.html',
  styleUrls: ['./validation.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationView implements OnInit {
  error = '';
  isLogged: boolean;
  schema?: any;
  editModel?: any;
  token: string;

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
    this.grange.core.auth.getValidationSchema(this.token).subscribe(
      res => {
        this.schema = res;
        markForCheck(this.cdr);
      }
    );
  }

  updateModel(event) {
    if (event.value) {
      this.editModel = event.value;
    }
  }

  onSubmit(data: any) {
    this.error = '';
    this.grange.core.auth.doValidation(this.token, this.editModel).subscribe(
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
