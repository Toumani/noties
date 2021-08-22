import {customElement, html, LitElement} from "lit-element";
import {Router} from "@vaadin/router";

import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';

@customElement('profile-view')
export class ProfileView extends LitElement {
  protected render() {
    return html`
      <vaadin-vertical-layout>
        <h1>Profil</h1>
        <vaadin-button
          theme="primary error"
          @click="${() => Router.go('/logout')}"
        >Déconnexion</vaadin-button>
      </vaadin-vertical-layout>
    `;
  }
}