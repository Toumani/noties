import {css, customElement, html, LitElement, property} from "lit-element";

import '@vaadin/vaadin-button';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-lumo-styles/icons';

@customElement('fab-comp')
export class FabComp extends LitElement {
  @property()
  icon: string | null = null;
  @property()
  onMouseClick: () => void;

  static styles = css`
    .fab {
      width: 60px;
      height: 60px;
      position: fixed;
      bottom: 5vh;
      right: 10vw;
      border-radius: 50px;
    }
    .icon {
      font-size: 1.5em;
    }
  `
  constructor() {
    super();
    this.onMouseClick = () => { }
  }

  protected render(): unknown {
    return html`
      <vaadin-button @click="${this.onMouseClick}" class="fab" theme="primary icon success" aria-label="Créer un note">
        <iron-icon class="icon" icon="lumo:plus"></iron-icon>
      </vaadin-button>
    `;
  }
}