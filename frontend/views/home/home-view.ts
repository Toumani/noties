import {
  customElement,
  html,
  css,
  LitElement, state, query
} from 'lit-element';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
// import '@vaadin/vaadin-icon';

import * as TodoEndpoint from 'Frontend/generated/TodoEndpoint';
import Note from "Frontend/generated/com/example/application/data/entity/Note";
import TodoModel from 'Frontend/generated/com/example/application/data/entity/TodoModel';
import { Binder, field } from '@vaadin/form';
import NoteModel from "Frontend/generated/com/example/application/data/entity/NoteModel";
import {NoteEndpoint} from "Frontend/generated/NoteEndpoint";
import Todo from "Frontend/generated/com/example/application/data/entity/Todo";

@customElement('home-view')
export class HomeView extends LitElement {
  @state()
  private viewingNote: Note | null = null;
  @state()
  private notes: Note[] = [];
  @query('#add-task')
  private addTaskInput!: HTMLInputElement

  private binder = new Binder(this, NoteModel);
  private taskBinder = new Binder(this, TodoModel);

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
    if (this.viewingNote)
        return html`
          <vaadin-button @click="${this.displayAllNotes}">Back to list</vaadin-button>
          <h1>${this.viewingNote.title}</h1>  
              <ul>
                  ${this.viewingNote.todos.map((todo) => html`<li>${todo.task}</li>`)}
              </ul>
              <div class="form">
                  <vaadin-text-field id="add-task" ...="${field(this.taskBinder.model.task)}"></vaadin-text-field>
                  <vaadin-button
                    theme="primary"
                    @click="${this.addTask}"
                    ?disabled="${this.taskBinder.invalid}"
                  >Add task</vaadin-button>
              </div>
        `;
    else
        return html`
            <div class="form">
                <vaadin-text-field ...="${field(this.binder.model.title)}"></vaadin-text-field>
                <vaadin-button
                        theme="primary"
                        @click="${this.createNote}"
                        ?disabled="${this.binder.invalid}">Add</vaadin-button>
            </div>
            <div>
                ${this.notes.map(note => html`
                <p @click="${() => this.displayOneNote(note.id as number)}">${note.title}</p>
              `)}
            </div>
        `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.notes = await NoteEndpoint.findAll();
  }

  async displayOneNote(noteId: number) {
    const note = await NoteEndpoint.findById(noteId)
    if (note as Note)
      this.viewingNote = note as Note
    // TODO else display en error
  }

  displayAllNotes() {
    this.viewingNote = null
  }

  async createNote() {
    const createNote = await this.binder.submitTo(NoteEndpoint.save);
    if (createNote) {
      this.notes = [...this.notes, createNote];
      this.binder.clear();
    }
  }

  async addTask() {
    if (this.viewingNote) {
      const todo = {task: this.addTaskInput.value, done: false, note: this.viewingNote} as Todo;
      const savedTodo = await TodoEndpoint.save(todo);
      if (savedTodo) {
        this.viewingNote = (await NoteEndpoint.findById(this.viewingNote.id as number)) as Note
        this.taskBinder.clear()
        this.requestUpdate()
      }
    }
  }
}
