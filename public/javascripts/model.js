export class ContactsModeler {
    constructor() {
      this.contacts = [];
      this.tags = [];
    }
  
    async retrieveContact(id) {
      try {
        const response = await fetch(`/api/contacts/${id}`);
        if (!response.ok) {
          throw new Error();
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching the contacts:', error);
      }
    }
  
    async retrieveContacts() {
      try {
        const response = await fetch('/api/contacts');
        if (!response.ok) {
          throw new Error();
        }
        this.contacts = await response.json();
      } catch (error) {
        console.error('Error fetching the contacts:', error);
      }
    }
  
    async deleteContact(id) {
      try {
        const response = await fetch(`/api/contacts/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      } catch (error) {
        alert(response.statusText);
      }
    }
  
    async createContact(data) {
      try {
        const response = await fetch('/api/contacts/', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if(!response.ok) {
          throw new Error(response.statusText)
        } else {
          const result = await response.json();
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    async updateContact(data) {
      try {
        const response = await fetch(`/api/contacts/${data.id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if(!response.ok) {
          throw new Error(response.statusText)
        } else {
          const result = await response.json();
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    getContacts() {
      return this.contacts;
    }
  
    getTags() {
      return this.tags;
    }
  }
  
