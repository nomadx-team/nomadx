import { Component, Element, Prop, State, Listen, Watch } from '@stencil/core';
// import { getPropEnabled, getPropScope } from '@nomadx/core';

@Component({
  tag: 'nomadx-skip-link',
  styleUrl: 'skip-link.scss'
})
export class SkipLink {

  /**
   * 1. Own Properties
   */

  /**
   * 2. Reference to host HTML element.
   */
  @Element() element: HTMLElement;

  /**
   * 3. State() variables
   * Inlined decorator, alphabetical order.
   */
  @State() isFocused = false;

  /**
   * 5. Public Property API
   */
  @Prop() to: string = '';
  @Watch('to')
  handleToChange(newValue) {
    const element = document.getElementById(newValue);
    if (!element) {
      console.error('No element found with id', newValue);
    }
    element.focus();
  }

  /**
   * 7. Component lifecycle events
   * Ordered by their natural call order, for example
   * WillLoad should go before DidLoad.
   */
  componentWillLoad() {
    this.handleToChange(this.to);
  }

  /**
   * 8. Listeners
   * It is ok to place them in a different location
   * if makes more sense in the context. Recommend
   * starting a listener method with "on".
   * Always use two lines.
   */
  @Listen('click')
  @Listen('keydown.space')
  @Listen('keydown.enter')
  onKeydown(e: KeyboardEvent) {
    e.preventDefault();
    const target = document.getElementById(this.to);
    target.setAttribute('tabindex', '-1');
    document.getElementById(this.to).focus();
  }

  /**
   * 11. hostData() function
   * Used to dynamically set host element attributes.
   * Should be placed directly above render()
   */
  hostData() {
    return {
      class: {
        'is-focused': this.isFocused
      },
      tabindex: '0',
      role: 'button'
    }
  }

  /**
   * 12. render() function
   * Always the last one in the class.
   */
  render() {
    return (
      <p> <slot /> </p>
    );
  }

}
