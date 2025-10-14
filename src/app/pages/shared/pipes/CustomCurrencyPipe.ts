 
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currency'
})
export class CustomCurrencyPipe implements PipeTransform {
  
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    value: number | string | null | undefined,
    currencyCode: string = 'COP',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol-narrow',
    digitsInfo?: string,
    locale: string = 'es-CO'
  ): string | null {
    return this.currencyPipe.transform(
      value,
      currencyCode,
      display,
      digitsInfo || '1.2-2',
      locale
    );
  }
}
 