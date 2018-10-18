# NgWormhole

This component allows rendering all of its content to be rendered elsewhere on
the page.

## Why?

Sometimes a dialog or tooltip has to be rendered outside of an element, as CSS
stacking contexts may interfere with positioning.

## Installation

```bash
$ yarn add ng-wormhole
```

Import `NgWormholeModule` in your app:

```typescript
import { NgModule } from '@angular/core';
import { NgWormholeModule } from 'ng-wormhole';

@NgModule({
  imports: [NgWormholeModule]
})
export class AppModule {}
```

### Example usage

index.html

```html
<body>
  <my-angular-app></my-angular-app>
  <div id="wormhole-target"></div>
</body>
```

In a component template:

```html
<my-popover *ngWormhole="'#wormhole-target'">...</my-popover>
```

The `<my-popover>` component will then be rendered in the `#wormhole-target`
element, it will also automatically cleaned up once your component will be
destroyed.

### Inputs

_ngWormhole: selector or element_
Which element to append to.

```html
<div #targetElement id="my-target"></div>
<my-popover *ngWormhole="targetElement">...</my-popover>
<!-- or by id/selector -->
<my-popover *ngWormhole="'#my-target'">...</my-popover>
```

_renderInPlace: boolean = false_
Should the component render its children in place?

```html
<my-popover *ngWormhole="'#wormhole-target'; renderInPlace: true">...</my-popover>
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Credits

This component is heavily inspired by
[ember-wormhole](https://github.com/yapplabs/ember-wormhole).
Contributions from @stefanpenner, @krisselden, @chrislopresto, @lukemelia,
@raycohen and others.
