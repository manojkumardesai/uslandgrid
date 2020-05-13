import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /** list of options */
  protected optionsList: any[] = [];



  /** control for the MatSelect filter keyword multi-selection */
  public optionMultiFilterCtrl: FormControl = new FormControl();

  /** list of options filtered by search keyword */
  public filteredMultiOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  /** control for the selected option for multi-selection */
  @Input() optionMultiCtrl: FormControl = new FormControl();
  @Input() data: any;
  @Input() enableCheckbox: boolean;
  @Input() ariaLabel = 'Field';
  @Output() changeDropdown = new EventEmitter();

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  constructor() { }

  ngOnInit() {
    // console.log(this.optionMultiCtrl);
    // set initial selection
    // this.optionMultiCtrl.setValue([this.optionsList[0]]);

    // listen for search field value changes
    this.optionMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterMultiOptions();
      });
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.optionsList = this.data;
      // load the initial options list
      this.filteredMultiOptions.next(this.optionsList.slice());
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  changeDD(event: any) {
    this.changeDropdown.emit(event);
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredMultiOptions.pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.optionMultiCtrl.patchValue(val);
        } else {
          this.optionMultiCtrl.patchValue([]);
        }
      });
  }

  /**
   * Sets the initial value after the filteredOptions are loaded initially
   */
  protected setInitialValue() {
    this.filteredMultiOptions
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredOptions are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterMultiOptions() {
    if (!this.optionsList) {
      return;
    }
    // get the search keyword
    let search = this.optionMultiFilterCtrl.value;
    if (!search) {
      this.filteredMultiOptions.next(this.optionsList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the options
    this.filteredMultiOptions.next(
      this.optionsList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

}