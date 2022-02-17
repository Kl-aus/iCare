import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeWhiteSpaces'
})
export class RemoveWhiteSpacesPipe implements PipeTransform {

  transform(value: any): any {
    if (value === undefined)
      {return 'undefined';}
    return value.replace(/\s/g, '');
  }
}
