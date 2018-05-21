import { Component, Prop, Element, Watch, Listen, State } from '@stencil/core';
import { Column } from '../column/column';
import { TableData } from '../../models/index';

@Component({
  tag: 'mrbl-table',
  styleUrl: 'table.css'
})
export class Table {

  @Prop() data: TableData = [];
  @Prop() labelledby: string = '';
  @Prop() striped: any;
  @State() isFocused = false;
  @State() isRoving = false;
  @State() focused: { row: number, column: number } = { row: null, column: null }
  @Element() el: HTMLElement;

  get columns(): Column[] {
    const nodeList = [...Array.from(this.el.querySelectorAll('mrbl-column-select')), ...Array.from(this.el.querySelectorAll('mrbl-column'))] as any;
    return nodeList;
  }
  get totalColumns(): number {
    return this.columns.length - 1;
  }
  get totalRows(): number {
    // -2 ignores the header row...
    const cols = this.columns[0] as any;
    return cols.querySelectorAll('mrbl-cell:not([slot="template"]').length;
  }


  @Listen('cellFocus') handleCellFocus({ detail }) {
    let { row, column } = detail;
    this.focused = { row, column };
    this.moveFocus(this.focused);
  }

  @Listen('focus') handleFocus() {
    if (!this.isFocused) {
      this.isFocused = true;
      // this.focused = { row: 0, column: 0 };
      // this.moveFocus(this.focused);
    }
  }

  @Listen('blur') handleBlur() {
    this.isFocused = false;
    this.isRoving = false;
    this.focused = { row: 0, column: 0 };
  }

  moveFocus({ row, column }) {
    this.isRoving = true;
    console.log('MOVE FOCUS', { row, column });
    this.columns.forEach((col: any) => {
      Array.from(col.querySelectorAll('mrbl-cell')).forEach((cell: any) => {
        const coords = { row: cell.row, column: cell.column };
        if (row === coords.row && column === coords.column) {
          cell.focus();
          this.focused = { row, column };
        }
      })
    });
  }

  @Listen('keydown.up') handleUpArrow() {
    if (this.isRoving) {
      let { row, column } = this.focused;
      if (row === 0) {
        if (column === 0) { return; }
        this.moveFocus({ row: this.totalRows - 1, column: column - 1})
      } else {
        this.moveFocus({ row: row - 1, column })
      }
    }
  }
  @Listen('keydown.left') handleLeftArrow() {
    if (this.isRoving) {
      let { row, column } = this.focused;

      if (column === 0) {
        if (row === 0) { return; }
        this.moveFocus({ row: row - 1, column: this.totalColumns })
      } else {
        this.moveFocus({ row: row, column: column - 1 })
      }
    }
  }
  @Listen('keydown.right') handleRightArrow() {
    if (this.isRoving) {
      let { row, column } = this.focused;

      if (column === this.totalColumns) {
        if (row === this.totalRows - 1) { return; }
        this.moveFocus({ row: row + 1, column: 0})
      } else {
        this.moveFocus({ row: row, column: column + 1 })
      }
    }
  }
  @Listen('keydown.down') handleDownArrow() {
    if (this.isRoving) {
      let { row, column } = this.focused;
      if (row === this.totalRows - 1) {
        if (column === this.totalColumns) { return; }
        this.moveFocus({ row: 0, column: column + 1 });
      } else {
        this.moveFocus({ row: row + 1, column })
      }
    }
  }

  @Listen('onRowSelect') onRowSelect({ detail }) {
    if (detail.length) {
      this.columns.forEach((col) => {
        for (let [rowIndex, cell] of Object.entries(col.children)) {
          console.log(rowIndex, cell);
          if (detail.includes(rowIndex)) {
            cell.classList.add('is-selected');
          } else {
            cell.classList.remove('is-selected');
          }
          };
        }
      )
    }
  }

  @Watch('data')
  passDataToChildren(newData: TableData) {
    this.el.style.setProperty('--columns', `${this.columns.length}`);
    this.columns.forEach((col, i) => {
      col.data = newData;
      col.index = i;
    })
  }

  componentWillLoad() {
    this.passDataToChildren(this.data);
  }

  hostData() {
    return {
      class: {
        'is-striped': this.striped,
        'is-selectable': this.el.querySelectorAll('mrbl-column-select').length
      },
      'role': 'grid',
      'aria-labelledby': this.labelledby,
      'aria-rowcount': this.columns[1].rows,
      'aria-colcount': this.columns.length,
      'aria-rowindex': this.focused.row + 1,
      'aria-colindex': this.focused.column + 1,
      'tabindex': '0'
    }
  }

  render() {
    return <slot/>
  }
}
