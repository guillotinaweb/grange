import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Grange } from '../grange.service';
import { RecoverInfo } from 'grange-core';
import { markForCheck } from 'develop/pastanaga-angular/projects/pastanaga/src/lib/common/utils';

@Component({
  selector: 'grange-validation',
  templateUrl: './validation.html',
  styleUrls: ['./validation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    debugger;
    this.token = '';
    this.grange.core.api.get('/@validate_schema/' + this.token).subscribe(
      res => {
        this.schema = res;
        markForCheck(this.cdr);
      }
    );
  }

  onSubmit(data: RecoverInfo) {
    this.error = '';
    this.grange.core.api.post('/@validation/' + this.token, this.editModel).subscribe(
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
