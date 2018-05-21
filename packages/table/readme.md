![Status](https://img.shields.io/badge/Status-Early_Alpha-red.svg?style=flat-square)
[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://github.com/ionic-team/stencil-component-starter)

# Marble

`<marble-table>` is a set of vanilla web-components to simplify the creation of awesome, accessible HTML tables.

[Try the demo!](TODO)

### For Developers:

Marble automatically creates rich HTML tables from your dataset. The flexible `<marble-data>` component allows you to generate tables through simple markup or bind data from Javascript, supporting CSV or TSV format, Markdown, JSON, and 2D Arrays.

Here's a minimal example using CSV format in your markup:
```html 
<marble-table>
  <marble-data slot="content">
    Column A, Column B, Column C, Column D
    0, true, Hello, World!
    2, false, Foobar, Bazbing
  </marble-data>
</marble-table>
```

Marble allows you to declare sortable columns, and will automatically handle sorting for you.

Marble tables are clean, responsive, and adaptable to any theme. Under the hood, we only apply a CSS reset and minimal styling. Marble avoids the ShadowDOM to give you more flexibility in styling.
```css
marble-table table {
  /* Style away! */
}
```

### For Your Users:

Marble comes pre-baked with `a11y` best practices like roving focus, keyboard navigation, and screen-reader support. Marble's goal is to make tables that work exactly like you'd expect them to, so we followed the [W3C's Best Practices](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/grid/dataGrids.html) and then added even more functionality (like beautiful clipboard support, cell selection, and meta sequences for keyboards.)

## Using this component

### Script tag

- [Publish to NPM](https://docs.npmjs.com/getting-started/publishing-npm-packages)
- Drop this `<script src='https://unpkg.com/marble-table@0.0.1/dist/marbletable.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install marble-table --save`
- Put a script tag similar to this `<script src='node_modules/marble-table/dist/marbletable.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install marble-table --save`
- Add an import to the npm packages `import marble-table;`
- Then you can use the element anywhere in your template, JSX, html etc
