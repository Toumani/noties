import {css, customElement, html, LitElement, property, query, state} from "lit-element";
import { Binder, field } from '@vaadin/form';
import { Router } from '@vaadin/router';
import Note from "Frontend/generated/com/example/application/data/entity/Note";
import {NoteEndpoint} from "Frontend/generated/NoteEndpoint";
import TodoModel from "Frontend/generated/com/example/application/data/entity/TodoModel";
import Todo from "Frontend/generated/com/example/application/data/entity/Todo";
import * as TodoEndpoint from "Frontend/generated/TodoEndpoint";

import '@vaadin/vaadin-dialog/vaadin-dialog';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';
import '@vaadin/vaadin-select/vaadin-select';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-item/vaadin-item';

import '../../components/Fab';
import {router} from "Frontend/index";

@customElement('note-view')
export class NoteView extends LitElement {
  @state()
  private viewingNote: Note | null = null;
  @state()
  private editNote = false;

  @query('#add-task')
  private addTaskInput!: HTMLInputElement

  private taskBinder = new Binder(this, TodoModel);

  static styles = css`
   :host {
     display: block;
     padding: var(--lumo-space-m) var(--lumo-space-l);
   }
 `;

  render() {
    if (this.viewingNote)
      return html`
        <vaadin-button @click="${() => Router.go('/notes')}">
          <iron-icon class="icon" icon="lumo:arrow-left"></iron-icon>
          Retour
        </vaadin-button>
        <h1>${this.viewingNote.title}</h1>
        <vaadin-vertical-layout
          style="width: 100%; align-items: stretch; padding-bottom: 15vh;"
        >
          ${this.viewingNote.todos.map((todo, index) => html`
            <task-card
              .task="${todo}"
              .edit="${this.editNote}"
              .index="${index}"
              .viewingNote="${this.viewingNote}"
              .onTaskUpdate="${this.updateTask}"
              .onTaskDelete="${(note: Note, index: number) => {
                this.deleteTask(note, index);
                this.requestUpdate();
              }}"
            ></task-card>`)}
  
          ${this.editNote ? html`
              <vaadin-horizontal-layout style="width: 100%;">
                <vaadin-text-field
                  id="add-task"
                  style="flex-grow: 1; margin-right: var(${'--lumo-space-s'});"
                  ...="${field(this.taskBinder.model.task)}"
                ></vaadin-text-field>
                <vaadin-button
                  theme="primary"
                  @click="${this.addTask}"
                  ?disabled="${this.taskBinder.invalid}"
                >Add task
                </vaadin-button>
              </vaadin-horizontal-layout>`
            : html``
          }
        </vaadin-vertical-layout>
        <fab-comp .icon="${this.editNote ? 'lumo:checkmark' : 'lumo:edit'}"
                  .onMouseClick="${() => (this.editNote = !this.editNote)}"></fab-comp>
      `;
    else {
      // TODO display skeleton
      return html`<span>NULL</span>`;
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    const noteId = router.location.params.id as unknown as number;
    if (noteId) {
      const note = await NoteEndpoint.findById(noteId);
      if (note)
        this.viewingNote = note as Note;
      else
        Router.go('/notes');
    }
    else
      Router.go('/notes');
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

  updateTask(viewingNote: Note, task: Todo) {
    if (viewingNote) {
      const taskToUpdate = viewingNote.todos.find(it => it.id === task.id);
      if (taskToUpdate) {
        taskToUpdate.done = task.done;
        taskToUpdate.task = task.task;
        this.requestUpdate()
      }
    }
  }

  deleteTask(viewingNote: Note, index: number) {
    if (viewingNote) {
      viewingNote.todos.splice(index, 1);
    }
  }
}

@customElement('task-card')
class TaskCard extends LitElement {
  @property()
  task: Todo | null = null;
  @property()
  edit: boolean = false;
  @property()
  index: number = -1;
  @property()
  viewingNote: Note | null = null;
  @property()
  onTaskUpdate: (viewingNote: Note, task: Todo) => void = () => {};
  @property()
  onTaskDelete: (viewingNote: Note, index: number) => void = () => {};

  static styles = css`
    .task-card {
      display: flex;
      margin-bottom: var(--lumo-space-m);
      padding: var(--lumo-space-m);
      justify-content: space-between;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border-left: 12px solid;
      box-shadow: 0 0 20px #ccc;
    }
    .task-card .title {
      font-size: var(--lumo-font-size-l);
    }
    .task-card vaadin-text-field {
      flex-grow: 1;
      margin-right: var(--lumo-space-s);
    }
  `

  protected render() {
    if (this.task !== null) {
      let cardStyle: string = '', titleStyle: string = '';
      if (this.task.done) {
        cardStyle = 'border-color: var(--lumo-tertiary-text-color);'
        titleStyle = 'text-decoration: line-through;color: var(--lumo-tertiary-text-color);'
      }
      if (!this.edit) {
        return html`
            <div class="task-card" style="${cardStyle}">
              <div class="title" style="${titleStyle}">${this.task.task}</div>
              <vaadin-checkbox .checked="${this.task.done}" @change="${this.toggleTaskDone}"></vaadin-checkbox>
            </div>
        `;
      }
      else {
        return html`
          <div class="task-card" style="${cardStyle}">
            <vaadin-text-field .value="${this.task.task}"></vaadin-text-field>
            <vaadin-button class="fab" theme="secondary icon error" @click="${this.deleteTask}" aria-label="Supprimer tâche">
              <iron-icon class="icon" .icon="${'lumo:cross'}"></iron-icon>
            </vaadin-button>
          </div>
        `
      }
    }
    else
      return  html`<span>NULL</span>`
  }

  private async toggleTaskDone() {
    if (this.task && this.viewingNote) {
      const task = {
        id: this.task.id,
        task: this.task.task,
        done: !this.task.done,
      } as Todo
      const updatedTask = await TodoEndpoint.save(task)
      if (updatedTask) {
        this.onTaskUpdate(this.viewingNote, updatedTask);
      }
    }
  }

  private async deleteTask() {
    if (this.index > -1 && this.task && this.viewingNote) {
      try {
        await TodoEndpoint.delete(this.task);
        this.onTaskDelete(this.viewingNote, this.index);
      } catch (e) {
        console.log(e);
      }
    }
  }

}