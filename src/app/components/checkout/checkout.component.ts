import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Luv2ShopFormService} from 'src/app/services/luv2-shop-form.service';
import {Country} from '../../common/country';
import {map} from 'rxjs/operators';
import {State} from '../../common/state';
import {Luv2ShopValidators} from '../../validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2shopFormService: Luv2ShopFormService) {
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        lastName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        email: new FormControl('', [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespaces]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:  new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    });

    let startMonth: number = new Date().getMonth() + 1;
    console.log('Start month: ' + startMonth);


    this.luv2shopFormService.getCreditCardMonths(startMonth).subscribe(data => {
      console.log('Credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });

    this.luv2shopFormService.getCreditCardYears().subscribe(data => {
      console.log('Credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });

    //populate countries
    this.luv2shopFormService.getCountries().subscribe(data => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode') }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state') }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country') }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode') }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth') }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear') }

  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }


    console.log(this.checkoutFormGroup.get('customer').value);
    console.log('Email : ' + this.checkoutFormGroup.get('customer').value.email);
    console.log('shippingAddress country: ' + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log('shippingAddress name: ' + this.checkoutFormGroup.get('shippingAddress').value.state.name);

    console.log('billingAddress country: ' + this.checkoutFormGroup.get('billingAddress').value.country.name);
    console.log('billingAddress name: ' + this.checkoutFormGroup.get('billingAddress').value.state.name);


  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2shopFormService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    });


  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2shopFormService.getStates(countryCode).subscribe(data => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // select the first state as a default
      formGroup.get('state').setValue(data[0]);
    });
  }
}
