import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SortingUtil {

  constructor() {}

  // insertion sort is best option of sorting in this usecase, because we are keeping our
  // array sorted with every insert, so we only need to find a right place for new value
  _insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentVal = arr[i]
        for (var j = i - 1; j >= 0 && arr[j] > currentVal; j--) {
             arr[j + 1] = arr[j]
        }
    arr[j + 1] = currentVal
    }
    return arr
  }

  // Recrusive Merge Sort
  _mergeSort(arr){
    if(arr.length <= 1) return arr
    let mid = Math.floor(arr.length/2)
    let left = this._mergeSort(arr.slice(0,mid))
    let right = this._mergeSort(arr.slice(mid))
    return _merge(left, right)

    function _merge(arr1, arr2){
      let results = []
      let i = 0
      let j = 0

      while(i < arr1.length && j < arr2.length) {
          if(arr2[j] > arr1[i]) {
              results.push(arr1[i])
              i++
          } else {
              results.push(arr2[j])
              j++
          }
      }

      while(i < arr1.length) {
          results.push(arr1[i])
          i++
      }
      while(j < arr2.length) {
          results.push(arr2[j])
          j++
      }

      return results
    }
  }
}
