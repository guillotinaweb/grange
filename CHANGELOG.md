# 1.3.3 (2020-07-29)

### Improvement

-   Upgrade to Angular 10

# 1.3.2 (2020-06-20)

### Improvement

-   Better demo and turorial
-   More utilities (getContextAs, addInContext, and deleteContext)
-   add refreshChildren method in folder view

# 1.3.1 (2020-05-28)

### Improvement

-   Improve the demo
-   More documentation
-   `updateContext` returns `onComplete` observable

### Bug fix:

-   Fix `updateContext` method

# 1.3.0 (2020-05-24)

### Feature

-   Allow to get or update context transparently, keeping state and backend in sync

# 1.2.1 (2020-05-03)

### Improvement

-   Publish to NPM

# 1.2.0 (2020-02-29)

### Breaking change

-   Upgrade to Angular 9 [ebrehault]

    #### Upgrade guidelines:

    -   Add `AngularSvgIconModule` in the app module `imports`:

        ```typescript
        AngularSvgIconModule.forRoot();
        ```

    -   grange-core, grange-form, pastanaga-angular and ngx-state-traverser are now in the `@guillotinaweb` organization, so imports must be fixed accordingly, example:

        ```typescript
        import { LoadingInterceptor } from '@guillotinaweb/grange-core';
        import { ButtonModule } from '@guillotinaweb/pastanaga-angular';
        import { GrangeFormModule } from '@guillotinaweb/grange-form';
        import { StateTraverserModule } from '@guillotinaweb/ngx-state-traverser';
        ```

    -   if used, `mrs.developer.json` must be updated to set the proper packages names.

# 1.1.0 (2020-02-23)

-   Support full login/auth logic [bloodbare]

# 1.0.0 (2019-10-27)

-   Use tags for all the dependencies
-   Fix Toaster [bloodbare]
-   Initial
