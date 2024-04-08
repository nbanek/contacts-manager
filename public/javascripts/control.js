export class ContactsController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
    }
  
    async init() {
      await this.model.retrieveContacts();
      this.populateTags(this.model.getContacts());
      this.view.init(this.model.getContacts(), this.model.getTags());
      this.bindInputEventListener();
      this.bindClickEventListener();
      this.bindSubmitEventListener();
      this.bindCheckEventListener();
  
    }
  
    populateTags(contacts) {
      //collect all unique tag names given to contacts
      let tags = contacts.reduce((acc, contact) => {
        if(contact.tags) {
          contact.tags.split(',').forEach(tag => {
            if(!acc.includes(tag)) {
              acc.push(tag);
            }
          })
        }
        return acc;
      }, [])
      this.model.tags = tags;
    }
  
    bindClickEventListener() {
      document.addEventListener('click', async event => {
        if (event.target.id === 'btn-add-contact') {
          this.handleAddContactClick(event);
        } else if (event.target.className === 'btn-cancel') {
          this.handleCancelClick(event);
        } else if (event.target.className === 'btn-delete-contact') {
          this.handleDelectContactClick(event);
        } else if (event.target.classList.contains('btn-edit-contact')) {
          await this.handleEditContactClick(event);
        } else if(event.target.id === 'btn-new-add-tag') {
          this.handleAddTagClick(event);
        }
      })
    }
  
    handleAddTagClick(event) {
      let timestamp= Date.now()
      const newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.classList.add('new-tag');
      newInput.name = 'customName' + timestamp;
      newInput.id = 'customId' + timestamp;
      document.getElementById(event.target.id).insertAdjacentElement('afterend', newInput);
    }
  
    async handleEditContactClick(event) {
      const id = event.target.dataset.id;
      let contact = await this.model.retrieveContact(id);
      this.view.renderEdit(contact, this.model.tags);
    }
  
    handleAddContactClick(event) {
      this.view.renderAddContact(this.model.tags);
    }
  
    handleCancelClick(event) {
      this.view.renderHome(this.model.tags);
      this.view.renderContacts(this.model.getContacts());
    }
  
    async handleDelectContactClick(event) {
      if (confirm("Do you want to delete this contact?")) {
        const id = event.target.dataset.id;
        this.model.deleteContact(id);
      } else {
        return;
      }
      await this.model.retrieveContacts()
      this.populateTags(this.model.getContacts())
      this.view.renderHome(this.model.tags)
      this.view.renderContacts(this.model.contacts);
    }
  
    bindSubmitEventListener(event) {
      document.addEventListener('submit', async event => {
        console.log(event.target.id)
        event.preventDefault();
        if (event.target.id === 'create-contact-form') {
          await this.handleCreateSubmitEvent(event);
        } else if (event.target.id === 'edit-contact-form') {
          await this.handleEditSubmitEvent(event);
        }
      })
    }
  
    async handleCreateSubmitEvent(event) {
      let form = event.target;
      let formData = new FormData(form);
      let json = this.formatToJSON(formData);
      await this.model.createContact(json);
      await this.model.retrieveContacts()
      this.populateTags(this.model.getContacts())
      this.view.renderHome(this.model.tags);
      this.view.renderContacts(this.model.contacts);
    }
  
    async handleEditSubmitEvent(event) {
      let form = event.target;
      let formData = new FormData(form);
      let json = this.formatToJSON(formData);
      console.log(json)
      await this.model.updateContact(json);
      await this.model.retrieveContacts();
      this.populateTags(this.model.getContacts())
      this.view.renderHome(this.model.tags);
      this.view.renderContacts(this.model.contacts);
    }
    
    bindInputEventListener() {
      document.addEventListener('input', event => {
        if (event.target.id === 'contact-search') {
          this.handleSearchEvent(event);
        }
      })
    }
  
    handleSearchEvent(event) {
      let searchBox = event.target;
      let contacts = this.model.getContacts();
      let checkedTags = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                             .map(checkbox => checkbox.id);
      let filteredContacts = this.filterContacts(contacts, searchBox.value, checkedTags);
      this.view.renderContacts(filteredContacts, searchBox.value);
    }
  
    bindCheckEventListener(event) {
      document.addEventListener('change', event => {
        if (event.target.type === 'checkbox') {
          event.preventDefault();
          this.handleCheckboxEvent();
        }
      });
    }
  
    handleCheckboxEvent(event) {
      let contacts = this.model.getContacts();
      let searchBoxValue = document.querySelector('#contact-search').value;
      let checkedTags = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                             .map(checkbox => checkbox.id);
      let filteredContacts = this.filterContacts(contacts, searchBoxValue, checkedTags);
      this.view.renderContacts(filteredContacts);
    }
  
    filterContacts(contacts, string, tag) {
      let filteredContacts;
      if (string && tag) {
        filteredContacts = contacts.filter(contact => {
          return contact.full_name.toLowerCase().includes(string.toLowerCase()) &&
                 (tag.every(tag => contact.tags.split(',').includes(tag)))
        });
        return filteredContacts;
      } else if (string) {
        filteredContacts = contacts.filter(contact => {
          return contact.full_name.toLowerCase().includes(string.toLowerCase());
        });
        return filteredContacts;
      } else if (tag) {
        filteredContacts = contacts.filter(contact => {
          return contact.tags && tag.every(tag => contact.tags.split(',').includes(tag));
        });
        return filteredContacts;
      } else {
        return contacts;
      }
    }
  
    formatToJSON(formData) {
      let data = {};
      for (let [key, value] of formData) {
        //replace contactId inputname to id for PUT request
        if(key === 'contactId') key = 'id';
        //accrue the custom tags into the tag property
        if(key.includes('custom')) key = 'tags';
        if (!data[key]) {
          data[key] = value;
        } else if (data['tags']) {
            data[key] += ',' + value;
          }
      }
      //format tags to lower case and remove duplicates
      if (data.tags) {
        data.tags = data.tags.toLowerCase();
        let tagsArray = data.tags.split(',');
        data.tags = tagsArray.filter((tag, index) => tagsArray.indexOf(tag) === index).join(',')
      }
      return data;
    }
  
  }
  