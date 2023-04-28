import keyboardTemplate from './keyboard-template.js';

class Keyboard {
  constructor() {
    this.keyboard = null;
    this.textarea = null;
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
        }</span>`,
      );

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="caseUp hidden">${
          isEng ? key.eng.caseUp : key.rus.caseUp
        }</span>`,
      );

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="caps hidden">${
          isEng
            ? key.eng.caps || key.eng.caseUp
            : key.rus.caps || key.rus.caseUp
        }</span>`,
      );

      spanElement.insertAdjacentHTML(
        'beforeEnd',
        `<span class="shiftCaps hidden">${
          isEng
            ? key.eng.shiftCaps || key.eng.caseDown
            : key.rus.shiftCaps || key.rus.caseDown
        }</span>`,
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

  initKeyboard(template) {
    this.initDom(template);
  }
}

new Keyboard().initKeyboard(keyboardTemplate);
