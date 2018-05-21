import { Component, Element, Prop, Watch, State, Event, EventEmitter, Method } from '@stencil/core';
import { TableData } from '../../models';


@Component({
  tag: 'mrbl-column-select',
  styleUrl: 'column-select.css'
})
export class ColumnSelect {

  @Prop() data: TableData = [];
  @Prop() index: number = 0;
  // @State() rows: number = 0;
  @State() selected: number[] = [];
  @Element() el: HTMLElement;

  @Event() onRowSelect: EventEmitter;
  // @Watch('data') handleData(newData: TableData) {
  // }
  @Watch('index') updateIndex(newIndex: number) {
    this.el.style.setProperty('--column-index', `${newIndex}`);
  }

  @Method() get rows(): number {
    return Object.keys(this.data[0]).length;
  }

  @Method() get children(): HTMLMrblCellElement[] {
    return Array.from(this.el.querySelectorAll('mbrl-cell'));
  }

  selectHandler(i: number | 'all', checked) {
    if (i === 'all') {
      if (checked) {
        this.selected = [];
        for (let j = 0; j < this.rows + 1; j++) {
          this.selected.push(j);
        }
      } else {
        this.selected = [];
      }
    } else {
      if (checked) { this.selected = [...this.selected, i] }
      else { this.selected = [...this.selected.filter(x => x !== i)] }
    }

    this.onRowSelect.emit(this.selected);
  }

  componentWillLoad() {
    // this.handleData(this.data);
    this.updateIndex(this.index);
  }

  render() {
    const Children = () => {
      const rows = [];
      for (let i = 0; i < this.rows + 1; i++) {
        const isSelected = this.selected.includes(i);
        rows.push(
          <mrbl-cell class={isSelected ? 'is-selected' : ''}>
          <input type="checkbox" id={`row-${i}-checkbox`} onInput={(e: any) => this.selectHandler(i, e.target.checked)} checked={isSelected}></input>
        </mrbl-cell>)
      }
      return rows;
    }

    return [
      <mrbl-header slot="header">
        <input type="checkbox" id={`row-header-checkbox`} onInput={(e: any) => this.selectHandler('all', e.target.checked)} checked={this.selected.length === this.rows + 1}></input>
      </mrbl-header>,
      <Children />
    ]
  }
}
