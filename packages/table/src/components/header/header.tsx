import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'mrbl-header',
  styleUrl: 'header.css'
})
export class Header {

  @Prop() sortable: any;


  hostData() {
    return {
      tabindex: '-1',
      role: 'colheader',
      scope: 'col'
    }
  }

  render() {
    if (this.sortable) {
      return [
        <h3> <slot/> </h3>,
        <button></button>
      ]
    } else {
      return (
        <h3> <slot /> </h3>
      );
    }
  }
}
