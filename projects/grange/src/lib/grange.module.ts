import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptor } from 'grange-core';
import { Resolver, Marker, Normalizer, TraversalModule } from 'angular-traversal';
import { RESTAPIResolver, TypeMarker, FullPathNormalizer } from './traversal';
import { WidgetRegistry, SchemaFormModule } from 'ngx-schema-form';
import { GrangeFormWidgetRegistry, GrangeFormModule } from 'grange-form';
import { StateTraverserModule } from 'ngx-state-traverser';
import { GrangeStateModule } from './state/module';
import { FolderView } from './views/folder';
import { ViewView } from './views/view';

import { LoginView } from './views/user/login';
import { ForgotView } from './views/user/forgot';
import { ValidationView } from './views/user/validation';
import { RegisterView } from './views/user/register';
import { CallbackView } from './views/user/callback';
import {
    TextFieldModule,
    ButtonModule,
    ControlsModule,
    TranslateModule,
    ToasterModule,
    TooltipModule
} from 'pastanaga-angular';
import { FormsModule } from '@angular/forms';
import { GRANGE_TRANSLATIONS_EN } from './i18n/en';
import { AddView } from './views/add';
import { EditView } from './views/edit';
import { ActionsComponent } from './components/actions';
import { ToastContainerComponent } from './components/toast-container';
import { BreadcrumbsComponent } from './components/breadcrumbs';

const VIEWS = [
    AddView,
    EditView,
    FolderView,
    LoginView,
    ForgotView,
    ValidationView,
    CallbackView,
    RegisterView,
    ViewView,
];
const COMPONENTS = [
    ActionsComponent,
    ToastContainerComponent,
    BreadcrumbsComponent,
];
@NgModule({
    declarations: [
        ...VIEWS,
        ...COMPONENTS,
    ],
    entryComponents: VIEWS,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        StateTraverserModule,
        GrangeFormModule,
        TraversalModule,
        GrangeStateModule,
        TextFieldModule,
        ButtonModule,
        ControlsModule,
        TranslateModule,
        SchemaFormModule.forRoot(),
        ToasterModule,
        TooltipModule,
    ],
    exports: [
        ...VIEWS,
        ...COMPONENTS,
    ]
})
export class GrangeModule {
}

@NgModule()
export class GrangeRootModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GrangeModule,
            providers: [
                { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
                { provide: Resolver, useClass: RESTAPIResolver },
                { provide: Marker, useClass: TypeMarker },
                { provide: Normalizer, useClass: FullPathNormalizer },
                { provide: WidgetRegistry, useClass: GrangeFormWidgetRegistry },
                { provide: 'LANG', useValue: 'en_US' },
                {
                    provide: 'TRANSLATIONS', useValue: {
                        en_US: { ...GRANGE_TRANSLATIONS_EN } as any,
                    }
                },
            ],
        };
    }
}
