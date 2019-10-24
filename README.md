# Grange

The Guillotina Restapi ANgular Environment.

The Grange is a rich extensible development toolkit.

It provides ready-to-use components and features (like login form, rich UI library, form generator, breadcrumbs, etc.).

It offers support for standard CRUD use-cases, allowing to build simple applications very rapidly.

Complex applications are supported too as the Grange is highly extensible and all the default views can be overridden.

## Principles

A Grange app is able to render any object served by the Guillotina backend.

It will use the path requested on the frontend to call the corresponding Guillotina object, like `http://localhost:4200/shoes/pink-boots` will produce a call to `` https://my-guillotina-server/db/app1/shoes/pink-boots` (assuming our Guillotina container supporting our app is named `app1`).

Let's assume the `pink-boots` object belongs to the `Shoes` type (a custom type defined in `app1`), it will be rendered using the default view (named `view`).

This view will be the generic `view` view unless we override the generic view with a custom one in order to make a specific rendering for shoes:

```typescript
this.grange.traverser.addView('view', 'Shoes', MyCustomShoesView);
```

If we try to access `http://localhost:4200/shoes/pink-boots/@@edit`, then the app will use the `edit` view (assuming the current user is allowed to modify the `pink-boots` object).

We can also define custom views, like:

```typescript
this.grange.traverser.addView('buy', 'Shoes', BuyShoesView);
```

It will make `http://localhost:4200/shoes/pink-boots/@@buy` a valid path.

When creating a custom view, we can use ready-to-use components (like breadcrumbs, form generator for editing, etc.)directly in the template, and we can use the Grange service to implement custom features in the TypeScript component.

The good thing about a Grange app is it is totally neutral about the Guillotina backend. It does not assume any hierarchical structure (like our shoes are not meant to be in `/shoes` folder, if we have some shoes object in `/autumn/new-shoes/red-sleepers`, the app can render it). It does not even assume what are the content types, we could make our Shoe type folderish and make an addable type to display shoes pictures named ShoesPicture, the app will offer the Add button in the actions components, the create form will work for ShoesPicture, etc. (obviously we probablyu want to implement some custom views for our ShoesPicture type, nevertheless the basic CRUD scenario would be working without any change).

## Building a basic Grange app

Install Grange in the Angular project:

```
npm install @guillotinaweb/grange
```

Add an empty `pastanaga-overrides.scss` file in `/src` (it might be used to override Pastanaga defaults).

Import in the `app.module.ts` the Grange module plus a minimal NgRx store, and provide the Guillotina backend URL to an existing container:

```typescript
import { GrangeRootModule } from '@guillotinaweb/grange';
import { TraversalModule } from 'angular-traversal';
import { StoreModule } from '@ngrx/store';

...
    imports: [
        ...
        GrangeRootModule.forRoot(),
        StoreModule.forRoot({}),
        TraversalModule,
    ],
    providers: [
        {
            provide: 'CONFIGURATION',
            useValue: {
                BACKEND_URL: 'http://my-g-server/db/container',
                CLIENT_TIMEOUT: 5000,
            },
        },
    ],
```

Note: if we do not have any container yet, we can create one by using the Executioner: http://my-g-server/+admin

Initialize the default views in `app.component.ts`:

```typescript
export class AppComponent {
    constructor(
        private views: GrangeViews,
    ) {
        this.views.initialize();
    }
}
```

Set the `traverser-outlet` in `app.component.html`:

```html
<traverser-outlet></traverser-outlet>
```

And load the Pastanaga fonts in `styles.scss`:
```scss
@import "~/pastanaga-angular/styles/common-reset";
$font-path: "~/pastanaga-angular/assets/fonts";
@import "~/pastanaga-angular/styles/fonts";
```

## Reference

### Grange views

#### `view`

It is the default view for a non-folderish object. It just displays the title and description of the current context object.

It also contains the CRUD actions component (add/edit/delete).

#### `add`

The `add` view will either open a creation form for the type passed as parameter, either presents the list of addable contents in the current context.

By selecting one, we are redirected to `./@@add?type=<the-type>`.

#### `edit`

The `edit` view displays a form allowing to modify the current object.

The form is dynamically generated according the current object schema provided by Guillotina.

#### `folder`

It is the default view for a folderish object. It displays the title and description of the current context object and links to its items.

It also contains the CRUD actions component (add/edit/delete).

#### `login`

The `login` view displays a login form and redirects to `view` if login is successful.

### Grange components

#### CRUD actions

#### Breadcrumbs

#### Toasters

### Services

### State

### Form generator

### UI library

## Developers

If we want to run Grange into an Anugular project using the GitHub master branches of all the dependencies, we need to use mrs-developer:

```
npm install mrs-developer
```

Then create the `mrs.developer.json`:

```json
{
    "angular-traversal": {
        "path": "/projects/traversal/src/lib",
        "url": "git@github.com:guillotinaweb/angular-traversal.git",
        "https": "https://github.com/guillotinaweb/angular-traversal.git",
        "branch": "master"
    },
    "grange": {
        "url": "git@github.com:guillotinaweb/grange.git",
        "https": "https://github.com/guillotinaweb/grange.git",
        "path": "/projects/grange/src",
        "branch": "pastanaga-variables-import"
    },
    "grange-core": {
        "url": "git@github.com:guillotinaweb/grange-core.git",
        "https": "https://github.com/guillotinaweb/grange-core.git",
        "path": "/projects/grange-core/src",
        "branch": "master"
    },
    "grange-form": {
        "path": "/projects/grange-form/src/lib",
        "url": "git@github.com:guillotinaweb/grange-form.git",
        "https": "https://github.com/guillotinaweb/grange-form.git",
        "branch": "master"
    },
    "ngx-schema-form": {
        "path": "/projects/schema-form/src/lib",
        "url": "git@github.com:guillotinaweb/ngx-schema-form.git",
        "https": "https://github.com/guillotinaweb/ngx-schema-form.git",
        "branch": "master"
    },
    "ngx-state-traverser": {
        "path": "/projects/ngx-state-traverser/src",
        "url": "git@github.com:guillotinaweb/ngx-state-traverser.git",
        "https": "https://github.com/guillotinaweb/ngx-state-traverser.git",
        "branch": "master"
    },
    "pastanaga-angular": {
        "url": "git@github.com:plone/pastanaga-angular.git",
        "https": "https://github.com/plone/pastanaga-angular.git",
        "path": "/projects/pastanaga/src",
        "branch": "pastanaga-variables-import"
    }
}
```

Install the NPM dependencies:

```
npm install angular-svg-icon jexl medium-editor rxjs tslib z-schema @angular/cdk @ngrx/core @ngrx/store @ngrx/effects @ngrx/store-devtools
```

Add the `pastanaga-overrides.scss` file in `/src` (it might be empty but should exist).

Declare the Pastanaga style folder to Angular SCSS compiler in `angular.json`:

```
"stylePreprocessorOptions": {
    "includePaths": [
        "src/develop/pastanaga-angular/projects/pastanaga/src/lib/styles"
    ]
},
```