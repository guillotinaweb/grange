import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TraversalModule } from 'angular-traversal';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { GrangeRootModule } from '../../../grange/src';
import { ButtonModule } from '@guillotinaweb/pastanaga-angular';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        GrangeRootModule.forRoot(),
        StoreModule.forRoot({}),
        TraversalModule,
        ButtonModule,
    ],
    providers: [
        {
            provide: 'CONFIGURATION',
            useValue: {
                BACKEND_URL: environment.backend,
                CLIENT_TIMEOUT: 5000,
            },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
