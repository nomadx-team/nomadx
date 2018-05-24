import { Component, Element, Prop, Method } from '@stencil/core';
import { ParsedData } from '../../models/data';
import { isMarkdown } from '../../utils/type';

import { RenderErrorNoParent } from '../../utils/errors';

import Papa from 'papaparse';
import Markdown from 'marked';
// import JSON5 from 'json5';

@Component({
  tag: 'nomadx-table-data',
  styleUrl: 'table-data.css'
})
export class TableData {

  @Element() element: HTMLElement;
  @Prop() data: any;

  componentWillLoad() {
    if (this.element.parentElement.tagName === 'NOMADX-TABLE') {
      return;
    } else {
      throw new Error(RenderErrorNoParent('nomadx-table-data', 'nomadx-table'))
    }
  }

  private getContent(): string {
    return this.element.innerHTML.trim();
  }

  private parseString(value: string): ParsedData {
    let data;
    let meta = { isHTML: false, is2DArray: false };
    switch (true) {
      case isMarkdown(value):
        let content = Markdown(value.trim());
        let container = document.createElement('div');
        container.innerHTML = content;
        const table = container.querySelector('table');
        data = Array.from(table.querySelectorAll("tr")).map((rowEl) => {
          return [...Array.from(rowEl.querySelectorAll('th')), ...Array.from(rowEl.querySelectorAll('td'))];
        }).map(row => row.map(col => {
          return { html: col.innerHTML, text: col.innerText }
        }));
        container.remove();
        meta.isHTML = true;
        break;
      default:
        data = Papa.parse(value.trim(), { dynamicTyping: true });
        if (!data.error) {
          data = data.data.map(row => row.map(col => {
            if (typeof col === 'string') { return col.trim() }
            else { return col }
          }));
          meta.is2DArray = true;
        }
        break;
    }

    return { data, meta };
  }

  private parseData(value: any): ParsedData {
    if (typeof value === 'string') {
      return this.parseString(value);
    } else if (Array.isArray(value)) {
      let data;
      let meta = { isHTML: false, is2DArray: false };
      const firstRow = value[0];
      if (Array.isArray(firstRow)) {
        // 2D Array
        data = value;
        meta.is2DArray = true;
      } else if (typeof firstRow === 'object') {
        // Array of Objects
        data = [];
        data[0] = Object.keys(firstRow);
        value.forEach((row, rowIndex) => {
          if (rowIndex !== 0) {
            data.push(Object.values(row).map(col => {
              if (typeof col === 'string') {
                col = col.trim();
                if (col === 'true' || col === 'false') {
                  return col === 'true';
                } else if (!Number.isNaN(Number.parseFloat(col as string))) {
                  return Number.parseFloat(col as string);
                } else {
                  return col;
                }
              }
            }))
          }
        })
        meta.is2DArray = true;
      }
      return { data, meta };
    }
  }

  @Method() getData(): ParsedData {
    console.log('Get Data');
    if (!this.data) {
      return this.parseString(this.getContent())
    } else {
      return this.parseData(this.data);
    }
  }

  hostData() {
    return {
      'aria-hidden': true
    }
  }

  render() {
    return (
      <slot/>
    );
  }
}
