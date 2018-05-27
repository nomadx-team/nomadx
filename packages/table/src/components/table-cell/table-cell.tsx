import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'nomadx-table-cell'
})
export class TableCell extends HTMLTableCellElement {

  @Prop() row: string | number;
  @Prop() column: string | number;

  render() {
    return <slot />;
  }
}
