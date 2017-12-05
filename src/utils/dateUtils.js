// Converts a date string to a dictionary containing two keys,
// "date" for the date in format mm-dd-YYYY
// "time" for the time in format HH:mm
export function dateToString(date_string) {
  const d = new Date(date_string);
  const datestring = {
    date: `${(`0${d.getMonth() + 1}`).slice(-2)
    }/${
      (`0${d.getDate()}`).slice(-2)
    }/${
      d.getFullYear().toString().substr(-2)}`,
    time: formatAMPM(d),
  };
  return datestring;
}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

const lang = {
  en: [
    'Good Morning',
    'Good Afternoon',
    'Good Evening',
  ],
};

export const greet = (time = new Date().getHours()) => {
  if (time < 12) {
    return lang.en[0];
  } else if (time <= 18) {
    return lang.en[1];
  } else if (time <= 23) {
    return lang.en[2];
  }

  return 'Invalid time';
};
