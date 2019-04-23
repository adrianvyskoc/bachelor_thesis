import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNameTitle'
})
export class FormatNameTitlePipe implements PipeTransform {
  /*
    Pipe-a na upravenie celého mena s titulmi a zobrazenie vo formáte: Priezvisko Meno, Akademické tituly
  */
  transform(value: any, args?: any): any {
    const titles = ['doc.', 'RNDr.', 'Mgr.', 'prof.', 'Dr.', 'Ing.', 'PhD.', 'CSc.']
    let tmp = ''
    let prefixTitles = '';
    
    if (!value) {
      return null
    }

    titles.forEach(t => {
      if (value.includes(t)) {
        value = value.replace(t, '')
        prefixTitles += ` ${t}`
      }
    })

    tmp = value.trim().replace(',', '').split(' ').reverse()
    
    /*
      Ošetrenie pre prípad stredných mien (pre najviac 2 stredné mená)
    */
    if(tmp[3]){
      return `${tmp[0]} ${tmp[1]} ${tmp[2]} ${tmp[3]},${prefixTitles}`;
    }
    else if(tmp[2]){
      return `${tmp[0]} ${tmp[1]} ${tmp[2]},${prefixTitles}`;
    }
    else
      return `${tmp[0]} ${tmp[1]},${prefixTitles}`;
  }

}