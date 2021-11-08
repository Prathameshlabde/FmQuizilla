export function timeFormat(time) {
  let hours = Math.floor(time / 3600);
  let seconds = time % 60;
  let minutes = Math.floor(time / 60);

  hours = hours.toString().length === 1 ? '0' + hours : hours;
  minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
  seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;
  return hours + ':' + minutes + ':' + seconds;
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getDateAbbrv(d) {
  if (d > 3 && d < 21) return 'th'; // thanks kennebec
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function getPropsCalender(selectedDate) {
  // console.log("selectedDate :-", selectedDate);
  let today = selectedDate.toDate();
  const currentDay = days[today.getDay()];
  let currentDate = today.getDate();
  let dateAbbrv = getDateAbbrv(currentDate);
  let currentYear = today.getYear();
  let currentMonth = today.toDateString().toString().slice(4, 7);

  let formatedDate = currentDate + dateAbbrv + ' ' + currentMonth;

  const calenders = {
    id: 'calender',
    currentDate,
    currentDay,
    dateAbbrv,
    currentMonth,
    currentYear,
    formatedDate,
  };

  // console.log("calenders :-", calenders);
  return calenders;
}

export function isEmpty(value) {
  let isEmpty = false;

  if (isUndefined(value) || isNull(value)) {
    isEmpty = true;
  } else if (typeof value === 'string' && value === '') {
    isEmpty = true;
  } else if (Array.isArray(value) && value.length === 0) {
    isEmpty = true;
  } else if (whatIsIt(value) === 'Object' && Object.keys(value).length === 0) {
    isEmpty = true;
  }
  return isEmpty;
}

export function isUndefined(value) {
  return value === undefined;
}

export function isNull(value) {
  return value === null;
}

let stringConstructor = 'test'.constructor;
let arrayConstructor = [].constructor;
let objectConstructor = {}.constructor;

export function whatIsIt(object) {
  if (object === null) {
    return 'null';
  } else if (object === undefined) {
    return 'undefined';
  } else if (object.constructor === stringConstructor) {
    return 'String';
  } else if (object.constructor === arrayConstructor) {
    return 'Array';
  } else if (object.constructor === objectConstructor) {
    return 'Object';
  } else if (typeof object === 'number') {
    return 'Number';
  } else {
    return 'unknown';
  }
}
