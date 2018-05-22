import { Component, Element, State } from '@stencil/core';
import { ParsedData } from '../../models/data';
import { RenderErrorNoChild } from '../../utils/errors';

@Component({
  tag: 'nomadx-table',
  styleUrl: 'table.scss'
})
export class Table2 {
  @Element() element: HTMLElement;
  private tableDataElement: HTMLNomadxTableDataElement;
  @State() ready = false;
  @State() data: ParsedData;

  componentWillLoad() {
    this.tableDataElement = this.element.querySelector('nomadx-table-data');
    if (!this.tableDataElement) {
      throw new Error(RenderErrorNoChild('nomadx-table', 'nomadx-table-data'));
    }
    this.tableDataElement.componentOnReady().then(() => {
      this.ready = true;
      this.data = this.tableDataElement.getData();
      return;
    })
  }

  render() {
    if (this.ready) {
      if (this.data.meta.isHTML) {
        return [
          <slot/>,
          <div class="nomadx-table--container" innerHTML={this.data.data as string}></div>
        ];
      } else if (this.data.meta.is2DArray) {
        return [
          <slot/>,
          <div class="nomadx-table--container">
            <table>{this.data.data}</table>
          </div>
        ];
      }
    }
  }

}
