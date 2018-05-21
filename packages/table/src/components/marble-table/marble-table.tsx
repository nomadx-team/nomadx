import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { Sort } from './icons';
import prettyprint from '../../utils/prettyprint';

@Component({
  tag: 'marble-table',
  styleUrl: 'marble-table.css'
})
export class AwesomeTable {

  @Element() element: HTMLElement;
  @Prop() data: any[][];
  @State() content: any[][];
  @State() source: any[][];
  @Prop() striped: any;
  // @Prop() hasColumnHeader = false;
  // @Prop() hasRowHeader = false;
  @Prop() sortable: string = '';
  @Prop() labelledby: string;

  @State() isFocused = false;
  @State() isRoving = false;
  @State() focusedCell = { row: 0, col: 0 };
  @State() selectedCells: { row: number, col: number }[] = [{ row: 0, col: 0 }];
  @State() sortState: { col: number, mode: 'ascending' | 'descending' | 'none' };

  componentWillLoad() {
    if (!this.data) {
      let data = this.element.querySelector('div[slot="content"]').innerHTML;
      this.content = data.split('\n')
        .map(row => row.trim())
        .filter(x => x)
        .map(row => row.split(',')
          .map(col => col.trim())
          .filter(x => x)
      )
      this.source = this.content;
    } else if (this.data) {
      this.source = this.data;
    }
  }

  @Listen('document:copy')
  handleCopy(e: ClipboardEvent) {
    if (this.isFocused) {
      e.clipboardData.setData('text/plain', `${prettyprint(this.source)}`);
      e.clipboardData.setData('text/html', '<table>' +  this.element.querySelector('table').innerHTML + '</table>');
      e.preventDefault();
    } else if (this.isRoving) {
      const cellData = this.element.querySelector(`[data-row="${this.focusedCell.row}"][data-col="${this.focusedCell.col}"]`)
      e.clipboardData.setData('text/plain', `${cellData.innerHTML}`);
      e.preventDefault()
    }
  }

  private isSortedCol(colIndex: number) {
    if (this.sortState) {
      return this.sortState.col === colIndex;
    } else {
      return false;
    }
  }

  private isSortableCol(colIndex: number) {
    const sortableCols = this.sortable.split(/\s+/).map(num => Number.parseInt(num, 10) - 1);
    return sortableCols.includes(colIndex);
  }

  private get isSortable() {
    return this.sortable !== '';
  }
  private get firstRow() {
    return this.isSortable ? 0 : 1;
  }
  private get firstCol() {
    return 0;
  }
  private get numRows() {
    return this.source.length - 1;
  }
  private get numCols() {
    return this.source[0].length - 1;
  }

  private handleCellFocus({ row, col }) {
    this.isRoving = true;
    this.focusedCell = { row, col };
  }

  private handleColSort(col) {
    if (!this.sortState) {
      this.sortState = { col, mode: 'none' };
    }
    if (this.sortState.col === col) {
      const mode = (this.sortState.mode === 'ascending') ? 'descending' : (this.sortState.mode === 'descending') ? 'none' : 'ascending';
      this.sortState = { col, mode };
    } else {
      this.sortState = { col, mode: 'ascending' };
    }
    console.log('Column Sort', col);
  }

  private handleTableFocus() {
    this.isFocused = true;
    this.isRoving = false;
  }
  private handleTableBlur() {
    this.isFocused = false;
    this.isRoving = false;
  }
  private moveFocus({ row, col }) {
    Array.from(this.element.querySelectorAll('tr')).forEach(rowEl => {
      const cells = [...Array.from(rowEl.querySelectorAll('th')), ...Array.from(rowEl.querySelectorAll('td'))]
      cells.forEach(cellEl => {
        const cellRow = Number.parseInt(cellEl.getAttribute('data-row'), 10);
        const cellCol = Number.parseInt(cellEl.getAttribute('data-col'), 10);
        if (row === cellRow && col === cellCol) {
          cellEl.focus();
        }
      })
    })
  }
  private addSelection({ row, col }) {
    console.log('Adding selection', { row, col });
    this.selectedCells.push({ row, col });
  }

  private beginRoving() {
    this.isFocused = false;
    this.isRoving = true;
    this.moveFocus({ row: this.firstRow, col: this.firstCol });
  }

  @Listen('keydown.enter')
  @Listen('keydown.space')
  handleSpace() {
    if (this.isFocused) {
      this.moveFocus({ row: this.firstRow, col: this.firstCol });
    } else if (this.isRoving) {
      if (this.focusedCell.row === 0 && this.isSortableCol(this.focusedCell.col)) {
        this.handleColSort(this.focusedCell.col);
      }
    }
  }

  @Listen('keydown.left')
  handleLeftArrow(e: KeyboardEvent) {
    if (this.isRoving) {
      let { row, col } = this.focusedCell;

      if (col !== this.firstCol) {
        if (e.shiftKey) {
          this.addSelection({ row: row, col: col - 1 })
          console.log('Shift key pressed!', this.selectedCells)
        }
        if (e.metaKey) {
          this.moveFocus({ row: row, col: this.firstCol })
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
          console.log('Shift key pressed!', e)
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

  applySort(colIndex: number, mode: string) {
    const sorted = this.source.slice(1).sort((a, b) => {
      let itemA = a[colIndex].toLowerCase();
      let itemB = b[colIndex].toLowerCase();
      if (!Number.isNaN(Number.parseFloat(itemA))) {
        itemA = Number.parseFloat(itemA);
        itemB = Number.parseFloat(itemB);
      }
      if (itemA < itemB) return -1;
      if (itemA > itemB) return 1;
      return 0;
    });
    if (mode === 'ascending') {
      return sorted;
    } else if (mode === 'descending') {
      return sorted.reverse();
    }
  }

  private buildRow(rowData: any[], rowIndex: number = 0, isHeader = false) {
    return <tr> {this.buildRowContents(rowData, rowIndex, isHeader)} </tr>
  }
  private buildRowContents(rowData: any[], rowIndex: number = 0, isHeader = false) {
    if (isHeader) {
      return rowData.map((col, colIndex) => {
        const tabindex = (this.isSortable && colIndex === this.firstCol) ? 0 : -1;
        if (this.isSortableCol(colIndex)) {
          const sortMode = this.isSortedCol(colIndex) ? this.sortState.mode : 'none';
          const headerClasses = {
            'sortable': true,
            'is-selected': this.selectedCells.includes({ row: rowIndex, col: colIndex }),
            'is-focused': this.focusedCell.row === rowIndex && this.focusedCell.col === colIndex
          }
          return <th
            class={headerClasses}
            scope="col"
            tabindex={tabindex}
            data-row={rowIndex}
            data-col={colIndex}
            aria-sort={sortMode}
            onClick={() => this.handleColSort(colIndex)}
            onFocus={() => this.handleCellFocus({ row: rowIndex, col: colIndex })}
          >
            {col}
            <Sort/>
          </th>
        } else {
          const headerClasses = {
            'is-selected': this.selectedCells.includes({ row: rowIndex, col: colIndex }),
            'is-focused': this.focusedCell.row === rowIndex && this.focusedCell.col === colIndex
          }
          return <th
            scope="col"
            class={headerClasses}
            tabindex={tabindex}
            data-row={rowIndex}
            data-col={colIndex}
            onFocus={() => this.handleCellFocus({ row: rowIndex, col: colIndex })}
          >
            {col}
          </th>
        }
      })
    } else {
      return rowData.map((col, colIndex) => {
        const tabindex = (!this.isSortable && rowIndex === this.firstRow && colIndex === this.firstCol) ? 0 : -1;
        const cellClasses = {
          'is-selected': this.selectedCells.includes({ row: rowIndex, col: colIndex }),
          'is-focused': this.focusedCell.row === rowIndex && this.focusedCell.col === colIndex
        }
        return <td
          class={cellClasses}
          tabindex={tabindex}
          onFocus={() => this.handleCellFocus({ row: rowIndex, col: colIndex })}
          data-row={rowIndex}
          data-col={colIndex}>
            {col}
        </td>
        })
    }
  }

  componentDidUnload() {
    console.log('Component removed from the DOM');
  }

  hostData() {
    return {
      class: {
        'is-striped': this.striped !== undefined && this.striped !== 'false'
      }
    }
  }

  render() {
    const { source } = this;
    let body;
    if (!this.sortState || this.sortState.mode === 'none') {
      body = source.slice(1).map((row, rowIndex) => this.buildRow(row, rowIndex + 1));
    } else {
      body = this.applySort(this.sortState.col, this.sortState.mode).map((row, rowIndex) => this.buildRow(row, rowIndex + 1));
    }
    return ([
      <slot name="content" aria-hidden="true"></slot>,
      <table
        tabindex="0"
        onFocus={() => this.handleTableFocus()}
        onBlur={() => this.handleTableBlur()}
        role="grid"
        aria-labelledby={this.labelledby}
        aria-rowindex={this.focusedCell.row + 1}
        aria-colindex={this.focusedCell.col + 1}
      >
        <thead>
          { this.buildRow(source[0], 0, true) }
        </thead>
        <tbody>
          { body }
        </tbody>
      </table>
    ]);
  }
}
