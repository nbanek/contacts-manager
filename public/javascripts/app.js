import { ContactsModeler } from './model.js';
import { ContactsViewer } from './view.js';
import { ContactsController } from './control.js';

document.addEventListener('DOMContentLoaded', async () => {
  const model = new ContactsModeler();
  const view = new ContactsViewer();
  const controller = new ContactsController(model, view);
  await controller.init();
});
