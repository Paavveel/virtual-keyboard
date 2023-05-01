import keyboardTemplate from './keyboard-template.js';

class Keyboard {
  constructor() {
    this.keyboard = null;
    this.textarea = null;
    this.current = {
      keyElement: null,
      code: null,
      event: null,
      char: null,
    };
    this.previous = {
      keyElement: null,
      code: null,
      event: null,
      char: null,
    };
  }

  initDom(template) {
    const { rows, shortcuts } = template;

    document.body.classList.add('body');

    const rootContainer = document.createElement('div');
    rootContainer.classList.add('container');

    const shortcutsElement = document.createElement('div');
    shortcutsElement.classList.add('shortcuts');

    const shortcutsTitleElement = document.createElement('h3');
    shortcutsTitleElement.textContent = 'Available shortcuts:';
    shortcutsTitleElement.classList.add('shortcuts-title');
    shortcutsElement.append(shortcutsTitleElement);

    const shortcutsListElement = document.createElement('ol');
    shortcutsListElement.classList.add('shortcuts-list');

    for (let i = 0; i < shortcuts.length; i += 1) {
      const shortcutsListItemElement = document.createElement('li');
      shortcutsListItemElement.classList.add('shortcuts-list-item');
      shortcutsListItemElement.textContent = shortcuts[i];
      shortcutsListElement.append(shortcutsListItemElement);
    }

    shortcutsElement.append(shortcutsListElement);

    const attentionElement = document.createElement('p');
    attentionElement.textContent = 'Please, pay attention!';
    attentionElement.classList.add('attention');
    shortcutsElement.append(attentionElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = 'The keyboard was created in the macOS';
    descriptionElement.classList.add('description');
    shortcutsElement.append(descriptionElement);

    rootContainer.append(shortcutsElement);

    const textareaElement = document.createElement('textarea');
    textareaElement.classList.add('textarea');
    this.textarea = textareaElement;

    rootContainer.append(this.textarea);

    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');

    const keyboardFragment = document.createDocumentFragment();

    function getKey(key, lang) {
      const isEng = lang === 'eng';

      const spanElement = document.createElement('span');
      spanElement.classList.add(lang);

      if (!isEng) {
        spanElement.classList.add('hidden');
      }

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="caseDown${isEng ? '' : ' hidden'}">${
          isEng ? key.eng.caseDown : key.rus.caseDown
        }</span>`
      );

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="caseUp hidden">${
          isEng ? key.eng.caseUp : key.rus.caseUp
        }</span>`
      );

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="caps hidden">${
          isEng
            ? key.eng.caps || key.eng.caseUp
            : key.rus.caps || key.rus.caseUp
        }</span>`
      );

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="shiftCaps hidden">${
          isEng
            ? key.eng.shiftCaps || key.eng.caseDown
            : key.rus.shiftCaps || key.rus.caseDown
        }</span>`
      );

      return spanElement;
    }

    for (let i = 0; i < rows.length; i += 1) {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');

      for (let j = 0; j < rows[i].length; j += 1) {
        const key = rows[i][j];

        const keyContainerElement = document.createElement('div');
        keyContainerElement.classList.add('key', key.className);

        const keyEngElement = getKey(key, 'eng');
        const keyRusElement = getKey(key, 'rus');

        keyContainerElement.append(keyEngElement, keyRusElement);

        rowElement.append(keyContainerElement);
      }

      keyboardFragment.append(rowElement);
    }

    this.keyboard.append(keyboardFragment);

    rootContainer.append(this.keyboard);

    document.body.prepend(rootContainer);
  }

  addActiveState() {
    this.current.keyElement.classList.add('active');
  }

  removeActiveState() {
    if (this.current.keyElement) {
      this.current.keyElement.classList.remove('active');
    }

    if (
      this.previous.keyElement &&
      this.previous.keyElement.classList.contains('active') &&
      !['CapsLock', 'ShiftLeft', 'ShiftRight'].includes(this.previous.code)
    ) {
      this.previous.keyElement.classList.remove('active');
      this.current.keyElement.classList.remove('active');
    }
  }

  implementKeyFunction() {
    let textareaValue = this.textarea.value;
    const textareaSelectionStart = this.textarea.selectionStart;
    const setTextareaValue = function setNewText() {
      if (
        textareaSelectionStart >= 0 &&
        textareaSelectionStart <= textareaValue.length
      ) {
        this.textarea.value =
          textareaValue.slice(0, textareaSelectionStart) +
          this.current.char +
          textareaValue.slice(textareaSelectionStart, textareaValue.length);
        this.textarea.selectionStart =
          textareaSelectionStart + this.current.char.length;
        this.textarea.selectionEnd =
          textareaSelectionStart + this.current.char.length;
      } else {
        this.textarea.value += this.current.char;
      }
    }.bind(this);

    if (keyboardTemplate.specials.includes(this.current.code)) {
      switch (this.current.code) {
        case 'Backspace':
          if (
            textareaSelectionStart > 0 &&
            textareaSelectionStart <= textareaValue.length
          ) {
            textareaValue =
              textareaValue.slice(0, textareaSelectionStart - 1) +
              textareaValue.slice(textareaSelectionStart, textareaValue.length);
            this.textarea.value = textareaValue;
            this.textarea.selectionStart = textareaSelectionStart - 1;
            this.textarea.selectionEnd = textareaSelectionStart - 1;
          }
          break;
        case 'Tab':
          this.current.char = '    ';
          setTextareaValue();
          break;
        case 'Enter':
          this.current.char = '\n';
          setTextareaValue();
          break;
        case 'MetaLeft':
          this.addActiveState();
          setTimeout(this.removeActiveState.bind(this), 300);
          break;
        case 'MetaRight':
          this.addActiveState();
          setTimeout(this.removeActiveState.bind(this), 300);
          break;
        default:
      }
    } else setTextareaValue();
  }

  keyDownHandler(e) {
    e.preventDefault();
    this.current.event = e;
    this.current.code = e.code;

    [this.current.keyElement] = this.keyboard.getElementsByClassName(e.code);

    if (this.current.keyElement) {
      this.current.char =
        this.current.keyElement.querySelectorAll(
          ':not(.hidden)'
        )[1].textContent;

      this.implementKeyFunction();

      if (
        !['CapsLock', 'ShiftLeft', 'ShiftRight'].includes(this.current.code)
      ) {
        this.addActiveState();
      }
    }
  }

  keyUpHandler(e) {
    this.current.event = e;
    this.current.code = e.code;

    [this.current.keyElement] = this.keyboard.getElementsByClassName(e.code);

    if (this.current.keyElement) {
      if (e.code !== 'CapsLock') {
        this.removeActiveState();
      }
    }
  }

  mouseDownHandler(e) {
    if (e.target.tagName === 'SPAN') {
      this.current.event = e;
      this.current.keyElement = e.target.closest('div');
      [, this.current.code] = this.current.keyElement.classList;
      this.current.char = e.target.textContent;

      if (this.current.code !== 'CapsLock') {
        this.addActiveState();
      }

      this.previous = {
        ...this.current,
      };

      this.implementKeyFunction();
      e.preventDefault();
    }
  }

  mouseUpHandler(e) {
    this.current.event = e;
    this.current.keyElement = e.target.closest('div');

    if (this.current.keyElement) {
      if (this.current.keyElement.classList.contains('key')) {
        [, this.current.code] = this.current.keyElement.classList;
      } else {
        this.current = {
          ...this.previous,
        };
      }

      if (this.current.code !== 'CapsLock') {
        this.removeActiveState();
      }
    }
  }

  initKeyboard(template) {
    this.initDom(template);

    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.keyUpHandler.bind(this));

    this.keyboard.addEventListener(
      'mousedown',
      this.mouseDownHandler.bind(this)
    );
    document.addEventListener('mouseup', this.mouseUpHandler.bind(this));
  }
}

new Keyboard().initKeyboard(keyboardTemplate);
