import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { PlayerComponent } from './player/player.component';
import { GrangeRootModule } from '../../../grange/src';
import { TraversalModule } from 'angular-traversal';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ButtonModule, TextFieldModule } from '@guillotinaweb/pastanaga-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
    declarations: [
        AppComponent,
        CanvasComponent,
        PlayerComponent,
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
        AngularSvgIconModule.forRoot(),
        ButtonModule,
        TextFieldModule,
        ButtonModule,
    ],
    providers: [
        {
            provide: 'CONFIGURATION',
            useValue: {
                BACKEND_URL: environment.backend,
                CLIENT_TIMEOUT: 5000,
                LOGO: 'assets/logo.svg',
            },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
