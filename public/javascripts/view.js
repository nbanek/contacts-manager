export class ContactsViewer {
    constructor() {
      //Handlebars setup
      Handlebars.registerPartial('contacts-partial', document.getElementById('contact-list-partial').innerHTML);
      this.contactListPartial = Handlebars.compile(document.getElementById('contact-list-partial').innerHTML);
      this.homeDisplayTemplate = Handlebars.compile(document.getElementById('home-display-template').innerHTML);
      this.createTemplate = Handlebars.compile(document.getElementById('contact-create-template').innerHTML);
      this.editTemplate = Handlebars.compile(document.getElementById('edit-contact-template').innerHTML);
      //static display div element
      this.display = document.getElementById('display');
    }
  
    renderEdit(contact, allTags) {
      this.clearDisplay();
      let tags = contact.tags && contact.tags.split(',');
      Handlebars.registerHelper('isSelected', function (option, selectedTags) {
        if(selectedTags){
          return selectedTags.includes(option) ? 'selected' : '';
        } else return '';
  
      });
      console.log({contact, tags, allTags})
      const html = this.editTemplate({contact, tags, allTags});
      this.display.innerHTML = html;
    }
  
    renderHome(tags) {
      this.clearDisplay();
      const html = this.homeDisplayTemplate({tags});
      this.display.innerHTML = html;
    }
  
    renderContacts(contacts, query = '') {
      const html = this.contactListPartial({ contacts, query});
      document.getElementById('contacts').innerHTML = html;
  
    }
  
    renderAddContact(tags) {
      this.clearDisplay();
      const html = this.createTemplate({tags});
      this.display.innerHTML = html;
    }
  
    getCreateContactForm () {return this.createContactForm};
  
    getEditContactForm () {return this.editContactForm};
  
    clearDisplay() {
      while (this.display.firstChild) {
        this.display.removeChild(this.display.firstChild);
      }
    }
  
    init(contacts, tags) {
      this.renderHome(tags);
      this.renderContacts(contacts);
    }
  
  }