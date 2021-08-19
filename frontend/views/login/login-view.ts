import {customElement, html, internalProperty, LitElement} from "lit-element";
import '@vaadin/vaadin-login/vaadin-login-form';
import { uiStore } from '../../stores/ui-store';
import {Router} from "@vaadin/router";

@customElement('login-view')
export class LoginView extends LitElement {
  @internalProperty()
  private error = false

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
  }

  protected render(): unknown {
    return html`
      <h1>Noties</h1>
      <vaadin-login-form
        no-forgot-password
        @login="${this.login}"
        @error="${this.error}"
      ></vaadin-login-form>
    `;
  }

  async login(e: CustomEvent) {
    try {
      await uiStore.login(e.detail.username, e.detail.password);
      Router.go('/home');
    } catch (e) {
      this.error = true;
    }
  }
}