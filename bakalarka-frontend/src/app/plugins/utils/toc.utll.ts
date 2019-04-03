import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TocUtil {

  private tocChanged = new Subject()

  createToc() {
    let headings = document.querySelectorAll('main *:nth-child(2) h2[id], h3[id], h4[id], h5[id]')

    const path = window.location.pathname
    const toc = Array.from(headings).map(heading => {
      return {
        path: `${path}#${heading['id']}`,
        text: heading['textContent'],
        level: heading['nodeName'][1]
      }
    })

    this.tocChanged.next(toc)
  }

  getTocUpdateListener() {
    return this.tocChanged.asObservable()
  }
}
