import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { MovePlayerComponent } from './player/move-player.dialog';
import { TeamComponent } from './team/team.component';
import { TeamContestsComponent } from './team/team-contests.component';
import { TeamListComponent } from './team/team-list.component';
import { GrangeRootModule } from '../../../grange/src';
import { TraversalModule } from 'angular-traversal';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
    ButtonModule,
    TextFieldModule,
    BadgeModule,
    ExpandModule,
    DialogModule,
    ControlsModule,
    SvgModule,
} from '@guillotinaweb/pastanaga-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
    declarations: [
        AppComponent,
        PlayerComponent,
        TeamComponent,
        MovePlayerComponent,
        TeamListComponent,
        TeamContestsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
        BadgeModule,
        ExpandModule,
        DialogModule,
        ControlsModule,
        SvgModule,
    ],
    providers: [
        {
            provide: 'CONFIGURATION',
            useValue: {
                BACKEND_URL: environment.backend,
                CLIENT_TIMEOUT: 5000,
                LOGO: 'assets/logo.svg',
                SOCIAL_LOGIN: false,
            },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
