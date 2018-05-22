import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ParsedData } from '../../models/data';
import { RenderErrorNoChild } from '../../utils/errors';

@Component({
  tag: 'nomadx-table',
  styleUrl: 'table.scss'
})
export class Table2 {

  @Prop() sortable: string = '';
  @Prop() labelledby: string;

  @Element() element: HTMLElement;
  private tableDataElement: HTMLNomadxTableDataElement;
  @State() ready = false;
  @State() data: ParsedData;
  @State() isFocused = false;
  @State() isRoving = false;
  @State() focusedCell = { row: 0, col: 0 };

  private get isSortable() {
    return this.sortable;
  }
  private get firstRow() {
    return this.isSortable ? 0 : 1;
  }
  private get firstCol() {
    return 0;
  }
  private get numRows() {
    return this.data.data.length - 1;
  }
  private get numHeaderRows() {
    return 1;
  }
  // private get numHeaderCols() {
  //   return this.data.data.length - 1;
  // }
  private get numCols() {
    return this.data.data[0].length - 1;
  }

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

  private beginRoving() {
    this.isFocused = false;
    this.isRoving = true;
    this.moveFocus({ row: this.firstRow, col: this.firstCol });
  }

  private moveFocus({ row, col }) {
    console.log('Move Focus', { row, col });
    Array.from(this.element.querySelectorAll('tr')).forEach(rowEl => {
      const cells = [...Array.from(rowEl.querySelectorAll('th')), ...Array.from(rowEl.querySelectorAll('td'))]
      cells.forEach(cellEl => {
        const cellRow = Number.parseInt(cellEl.getAttribute('data-row'), 10);
        const cellCol = Number.parseInt(cellEl.getAttribute('data-col'), 10);
        if (row === cellRow && col === cellCol) {
          cellEl.focus();
          return;
        }
      })
    })
  }

  @Listen('keydown.left')
  handleLeftArrow(e: KeyboardEvent) {
    if (this.isRoving) {
      let { row, col } = this.focusedCell;

      if (col !== this.firstCol) {
        if (e.shiftKey) {
          // this.addSelection({ row: row, col: col - 1 })
          // console.log('Shift key pressed!', this.selectedCells)
        }
        if (e.metaKey) {
          this.moveFocus({ row: row, col: this.firstCol })
          e.preventDefault();
        } else {
          this.moveFocus({ row: row, col: col - 1 })
        }
      }
    } else if (this.isFocused) {
      this.beginRoving();
    }
  }
  @Listen('keydown.right')
  handleRightArrow(e: KeyboardEvent) {
    if (this.isRoving) {
      let { row, col } = this.focusedCell;

      if (col !== this.numCols) {
        if (e.shiftKey) {
          // console.log('Shift key pressed!', e)
        }
        if (e.metaKey) {
          this.moveFocus({ row: row, col: this.numCols })
        } else {
          this.moveFocus({ row: row, col: col + 1 })
        }
      }
    } else if (this.isFocused) {
      this.beginRoving();
    }
  }

  @Listen('keydown.up')
  handleUpArrow(e: KeyboardEvent) {
    if (this.isRoving) {
      let { row, col } = this.focusedCell;

      if (row !== this.firstRow) {
        if (e.shiftKey) {
          console.log('Shift key pressed!', e)
        }
        if (e.metaKey) {
          this.moveFocus({ row: this.firstRow, col })
        } else {
          this.moveFocus({ row: row - 1, col })
        }
      }
    } else if (this.isFocused) {
      this.beginRoving();
    }
  }

  @Listen('keydown.down')
  handleDownArrow(e: KeyboardEvent) {
    if (this.isRoving) {
      let { row, col } = this.focusedCell;

      if (row !== this.numRows) {
        if (e.shiftKey) {
          console.log('Shift key pressed!', e)
        }
        if (e.metaKey) {
          this.moveFocus({ row: this.numRows, col })
        } else {
          this.moveFocus({ row: row + 1, col })
        }
      }
    } else if (this.isFocused) {
      this.beginRoving();
    }
  }

  private handleCellFocus(rowIndex, colIndex) {
    this.isRoving = true;
    this.focusedCell = { row: rowIndex, col: colIndex };
  }

  private handleTableFocus() {
    this.isFocused = true;
    this.isRoving = false;
  }
  private handleTableBlur() {
    this.isFocused = false;
    this.isRoving = false;
  }

  private isFocusedCell(rowIndex, colIndex) {
    return (this.focusedCell.row === rowIndex && this.focusedCell.col === colIndex);
  }
  private isSelectedCell(rowIndex, colIndex) {
    return (this.focusedCell.row === rowIndex && this.focusedCell.col === colIndex);
  }

  createTable = (data: any[][]) => {
    const [header, ...body] = data;
    return (
      <table
        tabindex="0"
        onFocus={() => this.handleTableFocus()}
        onBlur={() => this.handleTableBlur()}
        role="grid"
        aria-labelledby={this.labelledby}
        aria-rowindex={this.focusedCell.row + 1}
        aria-colindex={this.focusedCell.col + 1}
      >
        { this.createHeader([header]) }
        { this.createBody([...body]) }
      </table>
    )
  }

  createHeader = (rows: any[][]) => {
    return (
      <thead>
        {
          rows.map((row, rowIndex) => {
            const classes = {
              'has-focused-cell': rowIndex === this.focusedCell.row
            }
            return <tr class={classes}>
              {
                row.map((col, colIndex) => {
                  const classes = {
                    'is-focused': this.isFocusedCell(rowIndex, colIndex),
                    'is-selected': this.isSelectedCell(rowIndex, colIndex)
                  }
                  return <th
                    class={classes}
                    tabindex="-1"
                    onFocus={() => this.handleCellFocus(rowIndex, colIndex)}
                    data-row={rowIndex}
                    data-col={colIndex}
                  > {col} </th>
                })
              }
              </tr>
          })
        }
      </thead>
    );
  }

  createBody = (rows: any[][]) => {
    return (
      <tbody>
        {
          rows.map((row, rowIndex) => {
            rowIndex += this.numHeaderRows;
            const classes = {
              'has-focused-cell': rowIndex === this.focusedCell.row
            }
            return <tr class={classes}>
              {
                row.map((col, colIndex) => {
                  const classes = {
                    'is-focused': this.isFocusedCell(rowIndex, colIndex),
                    'is-selected': this.isSelectedCell(rowIndex, colIndex)
                  }
                  return <td
                    class={classes}
                    tabindex="-1"
                    onFocus={() => this.handleCellFocus(rowIndex, colIndex)}
                    data-row={rowIndex}
                    data-col={colIndex}
                  > {col} </td>
                })
              }
            </tr>
          })
        }
      </tbody>
    )
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
            { this.createTable(this.data.data as any[][]) }
          </div>
        ];
      }
    }
  }

}
