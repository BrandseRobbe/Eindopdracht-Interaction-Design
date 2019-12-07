let input;
let container;
let message;
let succes_message;
const controleer_email_format = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};
const controlinput = function() {
	if (this.value != '') {
		document.querySelector('.c-input-text').classList.add('c-has-val');
		document.querySelector('.c-gradient').classList.add('c-has-val-gradient');
	} else {
		document.querySelector('.c-input-text').classList.remove('c-has-val');
		document.querySelector('.c-gradient').classList.remove('c-has-val-gradient');
	}
};
const control_mail_value = function() {
	if (controleer_email_format(input.value)) {
		container.classList.remove('c-error');
	} else {
		container.classList.add('c-error');
		if (input.value == '') {
			message.innerHTML = 'E-mailadres is leeg';
		} else {
			message.innerHTML = 'Ingave is geen geldige e-mailadres';
		}
	}
};

const formsubmitted = function() {
	input.addEventListener('input', control_mail_value);
	control_mail_value();
	if (controleer_email_format(input.value)) {
		console.log('show validation');
		succes_message.style.opacity = 1;
	} else {
		succes_message.style.opacity = 0;
	}
};

const init = function() {
	input = document.querySelector('#js-email');
	input.addEventListener('input', controlinput);
	container = document.querySelector('.c-input-container');
	message = document.querySelector('.c-error-message');
	succes_message = document.querySelector('.c-show-succes');
	document.querySelector('#js-form').addEventListener('submit', formsubmitted);
};

document.addEventListener('DOMContentLoaded', init);
