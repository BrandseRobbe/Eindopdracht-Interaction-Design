let input;

const controlinput = function() {
  console.log(this.value);
  if (this.value != '') {
    document.querySelector('.c-input-text').classList.add('c-has-val');
  } else {
    document.querySelector('.c-input-text').classList.remove('c-has-val');
  }
};

const init = function() {
  console.log('dom');
  input = document.querySelector('#js-email');
  console.log(input);
  input.addEventListener('input', controlinput);
};

document.addEventListener('DOMContentLoaded', init);
