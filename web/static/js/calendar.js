import fullcalendar from 'fullcalendar'
import $ from 'jquery'

function toFullCalendarEvent (reservation) {
  let title = reservation.title;
  let start = reservation.start_time;
  let end   = reservation.computed.end_time;

  // Special handling for all_day == true
  if (reservation.all_day) {
    start = reservation.start_time.split('T')[0];
  }

  let res = { title, start };
  if (end) {
    res.end = end;
  }
  return res;
}

function populate (calendar) {
  $.ajax({
    url: '/reservations/',
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + document.access_token
    }
  })
  .then(body => {
    let fullCalendarEvents = _.map(body.data, toFullCalendarEvent);
    calendar.fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultView: 'agendaWeek',
      editable: true,
      events: fullCalendarEvents
    });
  });
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/i.test(value);
}

function isTime(value) {
  return /^\d{2}:\d{2}$/i.test(value);
}

function clearErrors() {
  $('.errors').hide();
}

function showError(elem, message) {
  elem.html(`<span style="color: red">${message}</span>`);
  elem.show();
  return 1;
}

function validate(form) {
  let errors = 0;

  // Date & time
  let startDate = $('#start-date');
  if (!isDate(startDate.val())) {
    errors += showError($('#start-date-err'), 'You must pick a date!');
  }
  let allDay = $('#all-day');
  let startTime = $('#start-time');
  if (!allDay.is(':checked') && !isTime(startTime.val())) {
    errors += showError($('#start-time-err'),
      'You must either pick a time OR an all day event!');
  }

  let type = $('#type').val();
  if (type === 'client') {
    // Validations specific to client reservations
    // Client ID
    let clientId = $('#client-id');
    if (!isUuid(clientId.val())) {
      errors += showError($('#client-id-err'), 'You must choose a client!');
    }

    // Service ID
    let serviceId = $('#service-id').val();
    if (!isUuid(serviceId) && serviceId !== 'other') {
      errors += showError($('#service-id-err'),
        'You must either choose a service or "other" and fill in the details.');
    }
  } else if (type === 'personal') {
    // Validations specific to personal reservations
    let employeeId = $('#employee-id').val();
    if (!isUuid(employeeId)) {
      errors += showError($('#employee-id-err'), 'You must select the employee.');
    }
  }
  console.log('errors:', errors);
  return errors === 0;
}

function formToReservation(form) {
  let data = (
    form.type === 'personal' ? handlePersonal(form) : handleClient(form));

  // {start_date, start_time} -> start_time
  if (data.all_day === 'on') {
    data.all_day = true;
    data.start_time = `${data.start_date} 00:00:00`;
  } else {
    data.all_day = false;
    data.start_time = `${data.start_date} ${data.start_time}:00`;
  }
  delete data.start_date;

  // Update the keys to be on the form "reservation[key]'.
  _.forEach(data, (value, key) => {
    data[`reservation[${key}]`] = value;
    delete data[key];
  });

  return data;
}

function handlePersonal(form) {
  return _.pick(form, [
    'type', 'title', 'all_day', 'employee_id', 'notes',
    'start_date', 'start_time'
  ]);;
}

function handleClient(form) {
  form = _.pick(form, [
    'type', 'all_day', 'employee_id', 'notes', 'start_date', 'start_time',
    'client_id', 'service_id', 'duration_hours', 'duration_minutes'
  ]);

  // duration_{hours, minutes} -> duration
  let hours = Number(form.duration_hours);
  let minutes = Number(form.duration_minutes);
  form.duration = hours * 60 + minutes;
  delete form.duration_hours;
  delete form.duration_minutes;

  return form;
}


$(() => {
  let calendar = $('#calendar');
  if (calendar.length === 0) {
    return;
  }

  populate(calendar);

  $('#reservation-submit').click(() => {
    $('#reservation-form').submit();
  })

  $('#reservation-form').submit(event => {
    // Start by validating the form
    clearErrors();
    let isValid = validate();
    if (!isValid) {
      event.preventDefault();
      return;
    }

    // Serialize it to a "reservation" object
    let arr = $('#reservation-form').serializeArray();
    // [{ name: 'a', value: 1 }, { name: 'b', value: 3 }] => {a: 1, b: 3}
    let form = _.zipObject(_.map(arr, 'name'), _.map(arr, 'value'));
    let body = formToReservation(form);

    $.ajax({
      method: 'POST',
      url: '/reservations',
      dataType: 'json',
      data: body,
      headers: {
        authorization: 'Bearer ' + document.access_token
      }
    })
    .done((data) => {
      // TODO(krummi): Reload the webpage or something...
      alert('created!');
    })
    .fail((err, status) => {
      console.log(err);
      console.log(status);
    });

    // TODO(krummi): Remove!
    event.preventDefault();
  });

  $('#client-id').select2();
  $('#employee-id').select2();

  $('#personal-btn').click(() => {
    $('#type').val('personal');

    $('#client').hide();
    $('#service').hide();
    $('#title').show();

    clearErrors();

    $('#employee-id > option[value=""]').text('Select an employee');
  });

  $('#client-btn').click(() => {
    $('#type').val('client');

    $('#client').show();
    $('#service').show();
    $('#title').hide();

    clearErrors();

    $('#employee-id > option[value=""]').text('Any employee');
  });

  // If all_day is checked, the start time should be disabled.
  $('#all-day').change(() => {
    let isChecked = $('#all-day').is(':checked');
    if (isChecked) {
      $('#start-time').val('');
      $('#start-time').attr('disabled', 'true');
    } else {
      $('#start-time').removeAttr('disabled');
    }
  });

  // Default the duration of the appointment to that of the service's
  $('#service-id').change(() => {
    let serviceId = $('#service-id').val();
    if (serviceId !== '') {
      let option = $(`#service-id > option[value="${serviceId}"]`);
      let duration = option.data('duration');
      let hours = Math.floor(duration / 60);
      let minutes = duration % 60;
      $('#duration-hours').val(hours);
      $('#duration-minutes').val(minutes);
      $('#service-details').show();
    } else {
      $('#service-details').hide();
    }
  });

  $('#client-btn').trigger('click');
});
