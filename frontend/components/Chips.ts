import { css, customElement, html, LitElement, property } from "lit-element";

import '@vaadin/vaadin-button';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-lumo-styles/icons';

@customElement('chips-comp')
export class Chips extends LitElement {
  @property()
  label: string = '';
  @property()
  onDelete: (label: string) => void = () => {};

  static styles = css`
    :host {
      display: flex;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 0px 0px 0px 15px;
    }
    .button {
      height: 26px;
    }
  `;

  protected render() {
    return html`
      <div>
        <span class="label">${this.label}</span>
        <vaadin-button @click="${() => this.onDelete(this.label)}" class="button" theme="tertiary error icon" aria-label="Supprimer">
          <iron-icon class="icon" icon="lumo:cross"></iron-icon>
        </vaadin-button>
      </div>
    `
  }
}