import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { Sort } from './icons';
import { ParsedData } from '../../models/data';
import { DIRECTION } from '../../models/direction';
import { RenderErrorNoChild } from '../../utils/errors';
import prettyprint from '../../utils/prettyprint';
import naturalCompare from 'natural-compare';

@Component({
  tag: 'nomadx-table',
  styleUrl: 'table.scss'
})
export class Table {

  /**
   * 1. Own Properties
   */
  private get isSortable() {
    return this.sortable !== '';
  }
  private get isSorted() {
    return this.sort.mode !== 'none';
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
  private get numCols() {
    return this.data.data[0].length - 1;
  }
  private tableDataElement: HTMLNomadxTableDataElement;

  /**
   * 2. Reference to host HTML element.
   */
  @Element() element: HTMLElement;

  /**
   * 3. State() variables
   * Inlined decorator, alphabetical order.
   */
  @State() data: ParsedData;
  @State() focusedCell = { row: -1, col: -1 };
  @State() isFocused = false;
  @State() isRoving = false;
  @State() ready = false;
  @State() sort: { col: number, mode: 'ascending' | 'descending' | 'none' } = { col: null, mode: 'none' };

  /**
   * 5. Public Property API
   */
  @Prop() sortable: string = '';
  @Prop() name: string;

  /**
   * 7. Component lifecycle events
   * Ordered by their natural call order, for example
   * WillLoad should go before DidLoad.
   */
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

  /**
   * 8. Listeners
   * It is ok to place them in a different location
   * if makes more sense in the context. Recommend
   * starting a listener method with "on".
   * Always use two lines.
   */
  @Listen('keydown.enter')
  @Listen('keydown.space')
  onSpaceOrEnter() {
    if (this.isFocused) {
      this.moveFocus({ row: this.firstRow, col: this.firstCol });
    } else if (this.isRoving) {
      if (this.focusedCell.row === 0 && this.isSortableColumn(this.focusedCell.col)) {
        this.handleCellClick(this.focusedCell.col, true);
      }
    }
  }

  @Listen('keydown.up')
  @Listen('keydown.down')
  @Listen('keydown.left')
  @Listen('keydown.right')
  onKeydownArrow(e: KeyboardEvent) {
    if (this.isRoving) {
      e.preventDefault();
      const direction = e.key as DIRECTION;
      let nextCell = this.getNextCell(this.focusedCell, direction);
      if (!nextCell) return;

      if (e.metaKey) {
        nextCell = this.getNextCellMeta(this.focusedCell, direction);
      }
      this.moveFocus(nextCell);
    } else if (this.isFocused) {
      this.beginRoving();
   }
  }

  @Listen('keydown.escape')
  onEscape() {
    if (this.isFocused || this.isRoving) {
      const next = this.element.querySelector(`[data-row="${this.firstRow}"][data-col="${this.firstCol}"]`) as HTMLElement;
      next.focus();
      next.blur();
      this.handleTableBlur();
    }
  }

  @Listen('document:copy')
  onCopy(e: ClipboardEvent) {
    if (this.isFocused) {
      e.clipboardData.setData('text/plain', `${prettyprint(this.data.data as any[][])}`);
      e.clipboardData.setData('text/html', '<table>' + this.element.querySelector('table').innerHTML + '</table>');
      e.preventDefault();
    } else if (this.isRoving) {
      const cellData = this.element.querySelector(`[data-row="${this.focusedCell.row}"][data-col="${this.focusedCell.col}"]`) as HTMLElement;
      e.clipboardData.setData('text/plain', `${cellData.innerText}`);
      e.preventDefault()
    }
  }

  /**
   * 10. Local methods
   * Internal business logic. These methods cannot be
   * called from the host element.
   */
  private beginRoving() {
    this.isFocused = false;
    this.isRoving = true;
    this.moveFocus({ row: this.firstRow, col: this.firstCol });
  }

  private moveFocus({ row, col }) {
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

  private sortData(data: any[][]): any[][] {
    const { col, mode } = this.sort;
    const headers = data.slice(0, this.numHeaderRows);
    const body = data.slice(this.numHeaderRows - 1);

    const sorted = body.slice(this.numHeaderRows)
      .sort((a, b) => {
        return naturalCompare(a[col], b[col]);
      });

    if (mode === 'ascending') {
      return [...headers, ...sorted];
    } else if (mode === 'descending') {
      return [...headers, ...sorted.reverse()];
    }
  }

  private handleCellFocus(rowIndex, colIndex) {
    this.isRoving = true;
    this.focusedCell = { row: rowIndex, col: colIndex };
  }
  private handleCellBlur() {
    this.focusedCell = { row: -1, col: -1 };
    this.isRoving = false;
  }
  private handleCellClick(colIndex: number, sortable: boolean = false) {
    if (sortable) {
      if (this.sort.col === colIndex) {
        const mode = (this.sort.mode === 'ascending') ? 'descending' : (this.sort.mode === 'descending') ? 'none' : 'ascending';
        this.sort = { col: colIndex, mode };
      } else {
        this.sort = { col: colIndex, mode: 'ascending' }
      }
    }
  }
  private handleTableFocus() {
    this.isFocused = true;
    this.isRoving = false;
  }
  private handleTableBlur() {
    this.isFocused = false;
    this.isRoving = false;
    this.focusedCell = { row: -1, col: -1 };
  }

  private isFocusedCell(rowIndex, colIndex) {
    return (this.focusedCell.row === rowIndex && this.focusedCell.col === colIndex);
  }
  private isSortableColumn(colIndex) {
    const sortableColumns = this.sortable.split(/\s+/).map(num => Number.parseInt(num, 10) - 1);
    return sortableColumns.includes(colIndex);
  }
  private isSortedColumn(colIndex) {
    return this.sort.col === colIndex;
  }

  /** Get coordinates of the next cell in a given direction */
  private getNextCell(cell: { row: number, col: number }, direction: DIRECTION) {
    switch (direction) {
      case DIRECTION.UP:
        return (cell.row !== this.firstRow) ? { row: cell.row - 1, col: cell.col } : null;
      case DIRECTION.DOWN:
        return (cell.row !== this.numRows) ? { row: cell.row + 1, col: cell.col } : null;
      case DIRECTION.LEFT:
        return (cell.col !== this.firstCol) ? { row: cell.row, col: cell.col - 1 } : null;
      case DIRECTION.RIGHT:
        return (cell.col !== this.numCols) ? { row: cell.row, col: cell.col + 1 } : null;
    }
  }

  /** Get coordinates of the first or last cell in a row/column */
  private getNextCellMeta(cell: { row: number, col: number }, direction: DIRECTION) {
    switch (direction) {
      case DIRECTION.UP:
        return (cell.row !== this.firstRow) ? { row: this.firstRow, col: cell.col } : null;
      case DIRECTION.DOWN:
        return (cell.row !== this.numRows) ? { row: this.numRows, col: cell.col } : null;
      case DIRECTION.LEFT:
        return (cell.col !== this.firstCol) ? { row: cell.row, col: this.firstCol } : null;
      case DIRECTION.RIGHT:
        return (cell.col !== this.numCols) ? { row: cell.row, col: this.numCols } : null;
    }
  }


/**
 * Render Helpers
 *
 */
    createTable = (data: any[][]) => {
    const [header, ...body] = data;
    return (
      <table
        tabindex="0"
        onFocus={() => this.handleTableFocus()}
        onBlur={() => this.handleTableBlur()}
        role="grid"
        aria-rowindex={this.focusedCell.row + 1}
        aria-colindex={this.focusedCell.col + 1}
      >
        { this.createCaption() }
        { this.createHeader([header]) }
        { this.createBody([...body]) }
      </table>
    )
    }

  createCaption = () => {
    let sortLabel;
    let sortMode;
    let sort = 'unsorted';
    if (this.isSortable && this.sort.mode !== 'none') {
      sortLabel = this.data.data[0][this.sort.col];
      sortMode = (this.sort.mode === 'ascending') ? 'up' : 'down';
      sort = `sorted by ${sortLabel}, ${sortMode}`
    }
    return (
      <caption aria-live="polite">
        { this.name }, { sort }
      </caption>
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
            return (
              <tr class={classes} role="row">
                {row.map((col, colIndex) => this.createCell('th', col, rowIndex, colIndex))}
              </tr>
            );
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
            return (
              <tr class={classes} role="row">
                {row.map((col, colIndex) => this.createCell('td', col, rowIndex, colIndex))}
              </tr>
            );
          })
        }
      </tbody>
    )
  }

  createCell(Tag: 'th' | 'td', content, rowIndex, colIndex) {
    const sortable = rowIndex === 0 && this.isSortableColumn(colIndex);
    const sort = sortable ? this.isSortedColumn(colIndex) ? this.sort.mode : 'none' : null;
    const classes = {
      'cell': true,
      'sortable': sortable,
      'is-focused': this.isFocusedCell(rowIndex, colIndex)
    }
    let attrs: any = {
      class: classes,
      tabindex: "-1",
      onFocus: () => this.handleCellFocus(rowIndex, colIndex),
      onBlur: () => this.handleCellBlur(),
      onClick: () => this.handleCellClick(colIndex, sortable),
      'data-row': rowIndex,
      'data-col': colIndex,
      'aria-sort': sort
    }
    if (Tag === 'th') {
      attrs = {
        ...attrs,
        scope: 'col',
        role: 'columnheader'
      }
    }
    return <Tag {...attrs} >
      { sortable ? this.createSortableCell(content) : content }
    </Tag>
  }

  createSortableCell(content) {
    return (
      <div class="cell--inner" role="button">
        { content }
        <Sort />
      </div>
    )
  }

  /**
   * 11. hostData() function
   * Used to dynamically set host element attributes.
   * Should be placed directly above render()
   */
  hostData() {
    return {
      class: {
        'is-focused': this.isFocused,
        'is-roving': this.isRoving
      }
    }
  }

  /**
   * 12. render() function
   * Always the last one in the class.
   */
  render() {
    if (this.ready) {
      const { data } = this;
      if (this.data.meta.isHTML) {
        return [
          <slot/>,
          <div class="nomadx-table--container" innerHTML={data.data as string}></div>
        ];
      } else if (this.data.meta.is2DArray) {
        if (this.isSorted) {
          const sortedData = this.sortData(data.data as any[][]);
          return [
            <slot/>,
            <div class="nomadx-table--container">
              { this.createTable(sortedData) }
            </div>
          ];
        } else {
          return [
            <slot />,
            <div class="nomadx-table--container">
              {this.createTable(data.data as any[][])}
            </div>
          ];
        }
      }
    }
  }

}
