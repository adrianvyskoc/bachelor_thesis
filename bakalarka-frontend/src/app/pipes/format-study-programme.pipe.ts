import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatStudyProgramme'
})
export class FormatStudyProgrammePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let tmp = ''

    if(!value) {
      return null;
    }

    tmp = value.split(' ')

    return `${tmp[1]}`
  }

}
