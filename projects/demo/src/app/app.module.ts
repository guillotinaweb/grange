import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { GrangeRootModule } from '../../../grange/src';
import { TraversalModule } from 'angular-traversal';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ButtonModule } from 'pastanaga-angular';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        TraversalModule,
        GrangeRootModule.forRoot(),
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            logOnly: environment.production,
            maxAge: 25
        }),
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
