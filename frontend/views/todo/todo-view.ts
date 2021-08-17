import {
  customElement,
  html,
  css,
  LitElement, state
} from 'lit-element';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';

import * as TodoEndpoint from 'Frontend/generated/TodoEndpoint';
import Todo from 'Frontend/generated/com/example/application/data/entity/Todo';
import TodoModel from 'Frontend/generated/com/example/application/data/entity/TodoModel';
import { Binder, field } from '@vaadin/form';

@customElement('todo-view')
export class TodoView extends LitElement {
  @state()
  private todos: Todo[] = [];
  private binder = new Binder(this, TodoModel);

  static styles = css`
   :host {
     display: block;
     padding: var(--lumo-space-m) var(--lumo-space-l);
   }
   .line-through {
     text-decoration: line-through;
   }
 `;

  render() {
    return html`
      <div class="form">
        <vaadin-text-field ...="${field(this.binder.model.task)}"></vaadin-text-field>
        <vaadin-button
          theme="primary"
          @click="${this.createTodo}"
          ?disabled="${this.binder.invalid}"
          >Add</vaadin-button>
      </div>
      <div class="todos">
        ${this.todos.map(
            todo => html`
              <div class="todo">
                <vaadin-checkbox
                  ?checked="${todo.done}"
                  @checked-changed="${(
                      e: CustomEvent
                    ) => this.updateTodoState(todo, e.detail.value)}"
                ></vaadin-checkbox>
                <span class="${todo.done ? 'line-through' : ''}">${todo.task}</span>
              </div>`
    )}
      </div>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.todos = await TodoEndpoint.findAll();
  }

  async createTodo() {
    const createdTodo = await this.binder.submitTo(TodoEndpoint.save);
    if (createdTodo) {
      this.todos = [...this.todos, createdTodo];
      this.binder.clear();
    }
  }

  updateTodoState(todo: Todo, done: boolean) {
    const updatedTodo = { ...todo, done };
    this.todos = this.todos.map(t => (t.id === todo.id ? updatedTodo : t));
    TodoEndpoint.save(updatedTodo);
  }
}
