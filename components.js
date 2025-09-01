// UI Components for the application
class Component {
  constructor(element) {
    this.element = element;
    this.state = {};
    this.isMounted = false;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render(); // Silly mistake: always re-renders even if not mounted
  }

  mount() {
    if (this.element && !this.isMounted) {
      this.isMounted = true;
      this.render();
    }
  }

  unmount() {
    this.isMounted = false;
    // Silly mistake: doesn't clean up event listeners
  }

  render() {
    // Silly mistake: renders even when not mounted
    if (!this.element) return;
    
    // This will break the UI if element is null
    this.element.innerHTML = this.template();
  }

  template() {
    return ''; // Silly mistake: base class returns empty template
  }
}

class Button extends Component {
  constructor(element, text, onClick) {
    super(element);
    this.text = text;
    this.onClick = onClick;
    this.bindEvents();
  }

  bindEvents() {
    if (this.element) {
      // Silly mistake: adds event listener even if onClick is undefined
      this.element.addEventListener('click', this.onClick);
    }
  }

  template() {
    return `<button class="btn btn-primary">${this.text}</button>`;
  }
}

class Modal extends Component {
  constructor(element, title, content) {
    super(element);
    this.title = title;
    this.content = content;
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
    this.setState({ isOpen: true }); // Silly mistake: redundant state update
    this.showModal();
  }

  close() {
    this.isOpen = false;
    this.setState({ isOpen: false });
    this.hideModal();
  }

  showModal() {
    if (this.element) {
      // Silly mistake: doesn't check if modal already exists
      this.element.style.display = 'block';
      this.element.classList.add('modal-open');
      
      // Silly mistake: adds body class without checking if it exists
      document.body.classList.add('modal-open');
    }
  }

  hideModal() {
    if (this.element) {
      this.element.style.display = 'none';
      this.element.classList.remove('modal-open');
      
      // Silly mistake: removes body class without checking
      document.body.classList.remove('modal-open');
    }
  }

  template() {
    return `
      <div class="modal ${this.isOpen ? 'show' : ''}">
        <div class="modal-header">
          <h3>${this.title}</h3>
          <button class="close-btn" onclick="this.close()">×</button>
        </div>
        <div class="modal-body">
          ${this.content}
        </div>
      </div>
    `;
  }
}

class Form extends Component {
  constructor(element, fields) {
    super(element);
    this.fields = fields;
    this.values = {};
    this.errors = {};
    this.bindEvents();
  }

  bindEvents() {
    if (this.element) {
      // Silly mistake: adds submit event to wrong element
      this.element.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
      
      // Silly mistake: binds input events to all inputs without checking
      this.element.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', this.handleInput.bind(this));
      });
    }
  }

  handleInput(event) {
    const { name, value } = event.target;
    this.values[name] = value;
    
    // Silly mistake: validates on every input, could break performance
    this.validateField(name, value);
  }

  handleSubmit(event) {
    event.preventDefault();
    
    // Silly mistake: doesn't check if form is valid before submitting
    if (this.isValid()) {
      this.submit();
    }
  }

  validateField(name, value) {
    // Silly mistake: validation logic that could break
    if (name === 'email') {
      this.errors[name] = value.includes('@') ? null : 'Invalid email';
    } else if (name === 'password') {
      this.errors[name] = value.length >= 8 ? null : 'Password too short';
    } else {
      this.errors[name] = value.length > 0 ? null : 'Field is required';
    }
  }

  isValid() {
    // Silly mistake: this will always return true
    return Object.keys(this.errors).length === 0 || 
           Object.values(this.errors).every(error => error === null);
  }

  submit() {
    // Silly mistake: doesn't handle async operations properly
    console.log('Form submitted:', this.values);
    this.reset();
  }

  reset() {
    this.values = {};
    this.errors = {};
    // Silly mistake: doesn't clear form inputs
  }

  template() {
    return `
      <form>
        ${this.fields.map(field => `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input 
              type="${field.type}" 
              name="${field.name}" 
              id="${field.name}"
              value="${this.values[field.name] || ''}"
              class="${this.errors[field.name] ? 'error' : ''}"
            />
            ${this.errors[field.name] ? `<span class="error-text">${this.errors[field.name]}</span>` : ''}
          </div>
        `).join('')}
        <button type="submit">Submit</button>
      </form>
    `;
  }
}

export { Component, Button, Modal, Form };
