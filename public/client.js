// jshint esversion: 6

var myApp = {};

myApp.init = () => {
	$.ajax({
		type: 'GET',
		url: '/data',
	}).done((data) => {
		appendPeople(reformatPeople(data));
	});

	// reformatting the data... there must be a better way
	// maybe should be appending WHILE reformatting 
	function reformatPeople(data) {
		let i = 0,
			people = [],
			temp;
		const n = data.length;

		for (i; i < n; i++) {
			currRow = data[i];
			if (people.length > 0 && currRow.name === people[people.length - 1].name) {
				if (!currRow.number) {
					continue;
				}
				temp = {
					type: currRow.type,
					number: currRow.number,
					id: currRow.pnid
				};
				people[people.length - 1].numbers.push(temp);
			}
			else {
				if (!currRow.number) {
					people.push({
						name: currRow.name,
						id: currRow.id
					});
				}
				else {
					people.push({
						name: currRow.name,
						id: currRow.id,
						numbers: [{
							type: currRow.type,
							number: currRow.number,
							id: currRow.pnid
						}]
					});
				}
			}
		}
		return people;
	}

	function appendPeople(people) {
		people.forEach((person) => {
			appendPerson(person);
		});
	}

	function appendPerson(person) {
		let numbersElement = '',
			i = 0;

		const nums = person.numbers;
		if (nums) {
			const n = nums.length;
			for (i; i < n; i++) {
				numbersElement += `
					<div class="contact-number" data-id="${nums[i].id}">
						<p><strong>${nums[i].type} </strong>${nums[i].number}</p>
						<button class="delete-number">X</button>
					</div>`;
			}
		}

		$('.contacts').append(`
			<div class="contact" data-id="${person.id}">
				<div class="contact-header">
					<h2>${person.name}</h2>
					<button class="delete-person">X</button>
				</div>
				<div class="contact-content">
					${numbersElement}
				</div>
				<form class="new-number">
					<select name="type">
						<option value="home">Home</option>
						<option value="work">Work</option>
						<option value="cell">Cell</option>
					</select>
					<input type="text" name="number">
					<input type="submit" value="Add">
				</form>
			</div>`);
	}
};


myApp.addNewPersonListener = () => {
	$('.new-contact form').on('submit', function(e) { // using arrow function breaks this
		e.preventDefault();
		const person = $(this).serialize(); 

		$.ajax({
			type: 'POST',
			url: '/person',
			data: person
		}).done((newPerson) => {
			appendNewPerson(newPerson);
		});
		this.reset(); 
	});

	function appendNewPerson(person) {
		$('.contacts').append(`
			<div class="contact" data-id="${person.id}">
				<div class="contact-header">
					<h2>${person.name}</h2>
					<button class="delete-person">X</button>
				</div>
				<div class="contact-content">
				</div>
				<form class="new-number">
					<select name="type">
						<option value="home">Home</option>
						<option value="work">Work</option>
						<option value="cell">Cell</option>
					</select>
					<input type="text" name="number">
					<input type="submit" value="Add">
				</form>
			</div>`);
	}
};

myApp.addNewPhoneListener = () => {
	$('.contacts').on('submit', '.new-number', function(e) {
		e.preventDefault();
		const phone = $(this).serialize() + '&pId=' + $(this).parent().attr('data-id'),
			target = $(this).parent().find('.contact-content');

		$.ajax({
			type: 'POST',
			url: '/phone',
			data: phone
		}).done((newPhone) => {
			appendNewPhone.call(target, newPhone);
		});
		this.reset(); 
	});

	function appendNewPhone(phone) {
		$(this).append(`
			<div class="contact-number" data-id="${phone.id}">
				<p><strong>${phone.type} </strong>${phone.number}</p>
				<button class="delete-number">X</button>
			</div>`);
	}
};

myApp.addDeletePersonListener = () => {
	$('.contacts').on('click', '.delete-person', function() {
		const target = $(this).parent().parent();
				id = target.attr('data-id');

		if (confirm('Delete?')) {
			$.ajax({
				type: 'DELETE',
				url: '/person/' + id,
			}).done(() => {
				target.remove();
			});
		}
	});
};

myApp.addDeleteNumberListener = () => {
	$('.contacts').on('click', '.delete-number', function() {
		const target = $(this).parent();
				id = target.attr('data-id');

		if (confirm('Delete?')) {
			$.ajax({
				type: 'DELETE',
				url: '/phone/' + id,
			}).done(() => {
				target.remove();
			});
		}
	});
};

$(() => {
	myApp.init();
	myApp.addNewPersonListener();
	myApp.addNewPhoneListener();
	myApp.addDeletePersonListener();
	myApp.addDeleteNumberListener();
});