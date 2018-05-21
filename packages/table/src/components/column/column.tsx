import { Component, Element, Method, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { TableData } from '../../models/index';

@Component({
  tag: 'mrbl-column',
  styleUrl: 'column.css'
})
export class Column {

  @Prop() data: TableData = [];
  @Prop() index: number = 0;
  @Prop() select: any;
  @State() entries: (string | number | boolean)[] = [];
  @State() isSelected: boolean = false;
  @Event() cellSelect: EventEmitter;

  @State() red: any;

  @State() test: any[] = [];
  @Prop() bind: string;
  @Element() el: HTMLElement;

  @Method() get rows() {
    return Array.from(this.el.querySelectorAll('mrbl-cell'));
  }

  @Method() get children(): HTMLMrblCellElement[] {
    return Array.from(this.el.querySelectorAll('mbrl-cell'));
  }

  @Watch('bind') updateBind(newBind: string, oldBind: string) {
    this.el.classList.add(`column-${newBind.toLowerCase()}`);
    this.el.classList.remove(`column-${oldBind.toLowerCase()}`);
  }

  @Watch('index') updateIndex(newIndex: number) {
    this.el.style.setProperty('--column-index', `${newIndex + 1}`);
  }
  @Watch('data')
  updateColumn(newData: TableData) {
    this.entries = [...newData.map(entry => entry[this.bind])];
    console.log(this.entries);
  }

  componentWillLoad() {
    this.updateColumn(this.data);
    this.updateIndex(this.index);
    this.updateBind(this.bind, '');
    this.el.querySelector('mrbl-header').setAttribute('slot', 'header');
    const tmpl = this.el.querySelector('mrbl-cell');
    tmpl.setAttribute('slot', 'template');
    tmpl.setAttribute('aria-hidden', 'true');
    this.red = tmpl.red;
  }

  hostData() {
    return {
      class: {
        'is-selected': this.isSelected
      }
    }
  }

  render() {
    if (this.select) {
      return [
        <slot name="header" />,
        <slot name="template" />,
        <mrbl-cell></mrbl-cell>
      ]
    }
    const Children = () =>
      this.entries.map((entry, i) =>
        <mrbl-cell red={this.red} column={this.index} row={i}> <p slot="content">{entry.toString()}</p> </mrbl-cell>
      )

    return [
      <slot name="header"/>,
      <slot name="template"/>,
      <Children />
    ]
  }
}
