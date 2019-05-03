import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TocUtil {

  private tocChanged = new Subject()

  createToc() {
    let headings = document.querySelectorAll('main *:nth-child(2) h2[id], main *:nth-child(2) h3[id], main *:nth-child(2) h4[id], main *:nth-child(2) h5[id]')

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

  noToc() {
    this.tocChanged.next([])
  }

  getTocUpdateListener() {
    return this.tocChanged.asObservable()
  }
}
