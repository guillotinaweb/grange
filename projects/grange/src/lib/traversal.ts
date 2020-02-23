import { Injectable } from '@angular/core';
import { Marker, Normalizer, Resolver } from 'angular-traversal';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIService, ResourceService, Error, ConfigurationService} from 'grange-core';
import { Grange } from './grange.service';
import { AddView } from './views/add';
import { ViewView } from './views/view';
import { EditView } from './views/edit';
import { LoginView } from './views/user/login';
import { ForgotView } from './views/user/forgot';
import { ValidationView } from './views/user/validation';
import { RegisterView } from './views/user/register';
import { CallbackView } from './views/user/callback';
import { FolderView } from './views/folder';

@Injectable()
export class InterfaceMarker extends Marker {
    mark(context: any): string[] {
        return context.interfaces;
    }
}

@Injectable()
export class TypeMarker extends Marker {
    mark(context: any): string[] {
        const markers = [context['@type']];
        if (context.is_folderish) {
            markers.push('folderish');
        }
        return markers;
    }
}

@Injectable()
export class RESTAPIResolver extends Resolver {
    constructor(private api: APIService, private resource: ResourceService) {
        super();
    }

    resolve(path: string, view: string, queryString: string): Observable<any> {
        return this.resource.get(path).pipe(catchError((err: Error) => {
            if (!!err.response && err.response.status === 401) {
                this.resource.traversingUnauthorized.emit(path);
                return of({path, isForbidden: true});
            } else {
                throw err;
            }
        }));
    }
}

@Injectable({
    providedIn: 'root'
})
export class GrangeViews {
    constructor(private grange: Grange) {}

    initialize() {
        this.grange.traverser.addView('add', 'folderish', AddView);
        this.grange.traverser.addView('edit', '*', EditView);
        this.grange.traverser.addView('login', '*', LoginView);
        this.grange.traverser.addView('validation', '*', ValidationView);
        this.grange.traverser.addView('forgot', '*', ForgotView);
        this.grange.traverser.addView('register', '*', RegisterView);
        this.grange.traverser.addView('callback', '*', CallbackView);
        this.grange.traverser.addView('view', '*', ViewView);
        this.grange.traverser.addView('view', 'folderish', FolderView);
    }
}

@Injectable()
export class FullPathNormalizer extends Normalizer {
    constructor(private config: ConfigurationService) {
        super();
    }

    normalize(path: string): string {
        if (path) {
            const base = this.config.get('BACKEND_URL');
            if (base.startsWith('/') && path.startsWith('http')) {
                path = '/' + path.split('/').slice(3).join('/');
            }
            if (path === base) {
                path = '/';
            } else if (path.startsWith(base)) {
                path = path.substring(base.length);
            }
        }
        return path;
    }
}
