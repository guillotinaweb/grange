# Grange

The Guillotina REST API aNGular Environment.

The Grange is a rich extensible development toolkit.

It provides ready-to-use components and features (like login form, rich UI library, form generator, breadcrumbs, etc.).

It offers support for standard CRUD use-cases, allowing to build simple applications very rapidly.

Complex applications are supported too as the Grange is highly extensible and all the default views can be overridden.

## Principles

A Grange app is able to render any object served by the Guillotina backend.

It will use the path requested on the frontend to call the corresponding Guillotina object, like `http://localhost:4200/shoes/pink-boots` will produce a call to `https://my-guillotina-server/db/app1/shoes/pink-boots` (assuming our Guillotina container supporting our app is named `app1`).

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

When creating a custom view, we can use ready-to-use components (like breadcrumbs, form generator for editing, etc.) directly in the template, and we can use the Grange service to implement custom features in the TypeScript component.

The good thing about a Grange app is it is totally neutral about the Guillotina backend. It does not assume any hierarchical structure (like our shoes are not meant to be in `/shoes` folder, if we have some shoes object in `/autumn/new-shoes/red-sleepers`, the app can render it). It does not even assume what are the content types, we could make our Shoe type folderish and make an addable type to display shoes pictures named ShoesPicture, the app will offer the Add button in the actions components, the create form will work for ShoesPicture, etc. (we probably want to implement some custom views for our ShoesPicture type, nevertheless the basic CRUD scenario would be working without any change).

## Building a basic Grange app

### Init a Grange project

If you don't have one already, create an angular project:

```
ng new my-project
```

In your Angular project, install Grange:

```
npm install @guillotinaweb/grange-schematic
ng add @guillotinaweb/grange-schematic
```

Run Guillotina (it requires Docker):

```
npm run guillotina
```

Import in the `app.module.ts` the Grange module plus a minimal NgRx store, and provide the Guillotina backend URL to our container:

```typescript
import { GrangeRootModule } from '@guillotinaweb/grange';
import { TraversalModule } from 'angular-traversal';
import { StoreModule } from '@ngrx/store';

...
    imports: [
        ...
        GrangeRootModule.forRoot(),
        StoreModule.forRoot(
            {},
            {
                runtimeChecks: {
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                },
            }
        ),
        TraversalModule,
    ],
    providers: [
        {
            provide: 'CONFIGURATION',
            useValue: {
                BACKEND_URL: 'http://127.0.0.1:8081/db/site',
                CLIENT_TIMEOUT: 5000,
            },
        },
    ],
```

Initialize the default views in `app.component.ts`:

```typescript
export class AppComponent {
    constructor(private views: GrangeViews) {
        this.views.initialize();
    }
}
```

Set the `traverser-outlet` in `app.component.html`:

```html
<traverser-outlet></traverser-outlet>
```

Run the application:

```
npm start
```

Our Angular app is now offering all Grange standard views (login, content creation, view, etc.).
We can login as root/root. By clicking on the "Plus" button, we get the available content types and we can a new content.
Once created we can delete it or edit it. The edit form is automatically generated based on the content type schema provided by Guillotina.

See [Grange tutorial](https://github.com/guillotinaweb/grange/blob/master/docs/TUTORAL.md) for more advanced examples.

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

The `<grange-actions></grange-actions>` component allows to display the Add / Edit / Delete buttons.

#### Breadcrumbs

The `<grange-breadcrumbs></grange-breadcrumbs>` component display the current breadcrumbs.

#### Toasters

By adding the `<grange-toast-container></grange-toast-container>` component in our main `app.component.html` template, we can use the toaster service to display toast messages:

```typescript
import { Grange } from 'grange';
...

    constructor(private grange: Grange) {}

    notify() {
        this.grange.ui.toaster.open('Hello', 'Close');
    }
```

### Services

All the services are accessible through the global `Grange` service

```typescript
import { Grange } from 'grange';
...

    constructor(private grange: Grange) {}
```

### The Grange service itself

The `grange` service provides handy methods for the most common needs.

`getContext()`: returns an Observable with the current traversed context.

`updateContext(changes)`: update the current context with the provided changes.
The update will be performed in the state immediately, and the corresponding PATCH will be done on the backend.
If the backend call fails, a GET call is done to update the state with the actual value.

#### The Traverser service

`this.grange.traverser`

It allows to declare new views. For example to add a custome view to edit the player type:

```typescript
this.grange.traverser.addView('edit', 'Player', EditPlayerPreferencesComponent);
```

It allows to navigate to a given path:

```typescript
this.grange.traverser.navigate(this.currentPlayer.team);
```

```typescript
this.grange.traverser.navigate(this.currentPlayer['@id'] + '/@@score');
```

It also allows to load the context for a tile:

```typescript
this.grange.traverser.loadTile('details', this.currentPlayer.team);
```

More details in the [Angular traversal documentation](https://github.com/guillotinaweb/angular-traversal).

#### Grange core

`this.grange.core`

The core service provides access to:

-   the authentication service, to login, logout, get the current username;
-   the resource service to interact with the Guillotina resources (get, create, modify, delete, find, share, get children, get navigation links, breadcrumbs, etc.);
-   the API service to handle all the low-level communications with the Guillotina backend: regular HTTP verbs or file downloading.

#### Redux store

`this.grange.store`

It allows to select state information or to dispatch actions. See below the "State" section.

#### Grange UI

`this.grange.ui`

It gives access to the main Pastanaga services: calendar, dialog, popup, sidebar, toaster and translate.

See "Pastanaga UI library" section below.

### State

Grange comes with a NgRx store.

TO BE COMPLETED

### Form generator

The Guillotina RESTAPI supports the JSON Schema standard.

Grange uses ngx-schema-form to render any JSON Schema as a dynamic form. The form widgets use the Pastanaga library.

```html
<sf-form [schema]="schema" [(model)]="editModel"></sf-form>
```

### Pastanaga UI library

TO BE COMPLETED

## Guillotina

Useful Guillotina operations:

-   create an app container for a new project

```
curl -XPOST --user root:root http://127.0.0.1:8081/db -d '{
  "@type": "Container",
  "id": "my-app"
}'
```

-   create a user

```
curl -XPOST --user root:root http://127.0.0.1:8081/db/site/users -d '{
    "@type": "User",
    "id": "inewton",
    "username": "inewton",
    "name": "Isaac Newton",
    "email": "isaac@newton.org",
    "password": "inewton",
    "user_roles": ["guillotina.Member"]
}'
```

-   give reader access to a user

```
curl -XPOST --user root:root http://127.0.0.1:8081/db/site/@sharing -d '{
    "prinrole": [
        {
            "principal": "inewton",
            "role": "guillotina.Reader",
            "setting": "Allow"
        }
    ]
}'
```

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
        "branch": "master"
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
    }
}
```

## Running Guillotina locally

```
npm run guillotina
```

It comes with few content types example, they can be easily adapted and extended by editing `g-api/config.yaml`.
