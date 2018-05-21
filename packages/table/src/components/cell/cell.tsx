import { Component, Prop, Element, State, Event, EventEmitter, Listen } from '@stencil/core';


@Component({
  tag: 'mrbl-cell',
  styleUrl: 'cell.css'
})
export class Cell {

  @Prop() header: any;
  @Prop() content: any;
  @Prop() red: any;
  @Prop() column: number;
  @Prop() row: number;
  @Element() el: HTMLElement;
  @State() isSelected: boolean = false;
  @State() isFocused: boolean = false;
  @Event() cellSelect: EventEmitter;
  @Event() cellFocus: EventEmitter;
  @Event() cellBlur: EventEmitter;

  @Listen('click')
  onClick() {
    console.log('Click');
    let { row, column } = this;
    this.isSelected = !this.isSelected;
    this.cellSelect.emit({ row , column });
  }
  @Listen('focus')
  onFocus() {
    let { row, column } = this;
    console.log('Focus', { row, column });
    this.isFocused = !this.isFocused;
    this.cellFocus.emit({ row, column });
  }

  @Listen('blur')
  onBlur() {
    let { row, column } = this;
    this.cellBlur.emit({ row, column });
  }

  componentWillLoad() {
    if (this.red) {
      this.el.style.setProperty('--color', 'red');
    }
  }

  hostData() {
    return {
      tabindex: this.row === 0 && this.column === 0 ? '0' : '-1',
      role: 'gridcell'
    }
  }

  render() {
    if (this.header) {
      return (
        <h3> <slot/> </h3>
      );
    } else if (this.content) {
      return (
        <div> <slot name="content"/> </div>
      )
    }
  }
}
