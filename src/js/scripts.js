'use strict';

pickmeup.defaults.locales['ru'] = {
	days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
	daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
	monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
};

pickmeup('#date', {
	format	: 'd.m.Y',
	locale: 'ru',
	default_date: false
});

tel.addEventListener('keypress', function(e) {
	if (e.keyCode != 43 && e.keyCode < 48 || e.keyCode > 57)
    e.preventDefault();
})

const btnFirst = document.querySelector('#btnFirst'),
	btnSecond = document.querySelector('#btnSecond'),
	btnThird = document.querySelector('#btnThird'),
	main = document.querySelector('.main'),
	tabFirst = document.querySelector('#tabFirst'),
	tabSecond = document.querySelector('#tabSecond'),
	tabThird = document.querySelector('#tabThird'),
	sendCode = document.querySelector('#sendCode');
	
const firstStepInputs = document.querySelectorAll('#firstFieldset input'),
	secondStepInputs = document.querySelectorAll('#secondFieldset input'),
	thirdStepInputs = document.querySelectorAll('#thirdFieldset input'),
	formInputs = document.querySelectorAll('form input');

btnFirst.addEventListener('click', function(e) {
	e.preventDefault();
  	if (validationStep(firstStepInputs) === true) {
		main.classList.remove('main--first');
		main.classList.add('main--second');
		tabFirst.classList.remove('tabs__item--active');
		tabSecond.classList.add('tabs__item--active');

		btnSecond.addEventListener('click', function(e) {
			e.preventDefault();
			if (validationStep(secondStepInputs) === true) {
				main.classList.remove('main--second');
				main.classList.add('main--third');
				tabSecond.classList.remove('tabs__item--active');
				tabThird.classList.add('tabs__item--active');

				btnThird.addEventListener('click', function(e) {
					e.preventDefault();
					if (validationStep(thirdStepInputs) === true) {
						displayFormData();
					}
				})
			}
		})
	}
})

function validationStep(inputs) {
	let valid = true;
	for (let i = 0; i < inputs.length; i++) {
	  const input = inputs[i];
	  const wrapper = input.closest('.form__input-wrap') || input.closest('.form__radio-wrap') || input.closest('.form__check-wrap');
	  if (input.required) {
		  resetError(wrapper);
		  if (!input.value || !input.validity.valid) {
			  showError(wrapper, 'Это поле обязательное для заполнения');
			  valid = false;
		  }
		  if (input === email) {
			  const emailRegExp = /\S+@\S+\.\S+/;
			  if (!emailRegExp.test(input.value)) {
				  showError(wrapper, 'Это поле обязательное для заполнения');
				  valid = false;
			  }
		  }
		  if (input === pass) {
			  if (pass.value != pass2.value) {
				  showError(wrapper, 'Пароли не совпадают');
				  valid = false;
			  }
		  }
		  if (input === code && input.value != rand) {
			  showError(wrapper, 'Неверный пароль');
			  valid = false;
		  }
	  }
  }
  return valid;
}

function showError(container, errorMessage) {
	if (!container.classList.contains('input-error')) {
		container.classList.add('input-error');
		const msgElem = document.createElement('span');
		msgElem.className = "error-message";
		msgElem.innerHTML = errorMessage;
		container.appendChild(msgElem);
	}
}

function resetError(container) {
	if (container.classList.contains('input-error')) {
		container.classList.remove('input-error');
		container.removeChild(container.lastChild);
	}
}

function resetErrorOnFocus(inputs) {
	for (let i = 0; i < inputs.length; i++) {
		const input = inputs[i];
		const wrapper = input.closest('.form__input-wrap') || input.closest('.form__radio-wrap') || input.closest('.form__check-wrap');
		input.addEventListener('focus', function() {
			resetError(wrapper);
		})
	}
}
resetErrorOnFocus(formInputs);

function displayFormData() {
	let data = '';
	const inputs = document.querySelectorAll('form input');
	for (let i = 0; i < inputs.length; i++) {
		const el = inputs[i];
		let inputValue = el.type === 'radio' ? el.checked : el.value;
		if (el.name && el.name) {
			data += el.name + ' = ' + inputValue + '\n';
		}
	}
	alert(data);
}

let rand;

sendCode.addEventListener('click', function(e) {
	e.preventDefault();
	rand = Math.floor(10000 + Math.random() * 90000);
	alert(rand);
	return rand;
})


