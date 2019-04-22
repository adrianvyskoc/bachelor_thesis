import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLastname'
})
export class FormatLastnamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const titles = ['doc.', 'RNDr.', 'Mgr.', 'prof.', 'Dr.', 'Ing.', 'PhD.', 'CSc.']
    let tmp = ''

    if (!value) {
      return null;
    }

    titles.forEach(t => {
      if(value.includes(t)) {
        value = value.replace(t, '')
      }
    })

    tmp = value.trim().replace(',', '').split(' ').reverse()

    return `${tmp[0]}`
  }

}
