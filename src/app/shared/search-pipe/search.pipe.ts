import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform<T>(list: T[], value: string): T[] {
    return value ? list.filter(item => this.find(item, value)) : list;
  }

  private find(item, value) {
    return Object.values(item).some(i =>
      typeof i === 'string' && i.toLowerCase().includes(value.toLowerCase())
    );
  }

}
