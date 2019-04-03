import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TocUtil {

  private tocChanged = new Subject()

  createToc() {
    let headings = document.querySelectorAll('main *:nth-child(2) h2, h3, h4, h5')

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
