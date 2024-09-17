import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(dateTimeString: string): string {
    const [day, month, year, hours, minutes] = dateTimeString.split(/[/ :]/).map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const formattedDate = date.toLocaleDateString('it-IT', dateOptions);
    const formattedTime = date.toLocaleTimeString('it-IT', timeOptions);

    return `${formattedDate} ${formattedTime}`;
  }

}
