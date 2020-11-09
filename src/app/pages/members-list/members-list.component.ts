import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProPublicaService} from '../../services/pro-publica.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  membersList = [];
  tableHeader = [];
  startHeaders = [];
  filterLength = 0;
  pagSize = 0;
  pagItems = [];
  currentPage = 1;
  pageArrows = {
    left: true,
    right: false
  };
  searchValue: any;
  tempMemberList = [];
  showAdvFilters = false;
  tableFilters = false;
  apiHasError = false;
  isLoading = true;
  hasError = false;

  constructor(private proPublica: ProPublicaService) {
  }

  async ngOnInit(): Promise<void> {
    // Define table starting columns
    this.startHeaders = ['first_name', 'last_name', 'title', 'gender', 'date_of_birth', 'office', 'phone'];
    // Await for Get MemberList from API
    await this.getMemberList();
    // Assign header filters available
    this.filterLength = this.tableHeader.length;
    // Total number of items got from the API
    this.pagSize = this.membersList.length;
    // Call set pagination function
    this.setPagination();
  }

  // Async | Getting data from Member Service API
  async getMemberList(): Promise<void> {
    await this.proPublica.getCongressMembers()
      .pipe(takeUntil(this.ngUnsubscribe)).toPromise()
      .then((data: { results: any }) => {
        this.membersList.push(...data.results[0].members);
        this.tempMemberList.push(...data.results[0].members);
        Object.keys(data.results[0].members[0]).map((value, index) => {
          if (this.startHeaders.includes(value)) {
            this.tableHeader.push({
              key: value,
              active: true
            });
          } else {
            this.tableHeader.push({
              key: value,
              active: false
            });
          }
        });
        this.isLoading = false;
        return data.results;
      })
      .catch(() => {
        this.hasError = true;
      });
  }

  // This functions show or hidden a column from the table
  showColumn(index: number): void {
    this.tableHeader[index].active = !this.tableHeader[index].active;
  }

  // This functions set the pagination of the table
  private setPagination(): void {
    let calcPages = 0;
    let calcDif = 0;
    let totalPages: number;
    if (this.pagSize < 11) {
      totalPages = 1;
    } else {
      calcPages = Math.round(this.pagSize / 10);
      calcDif = this.pagSize % 10;
      totalPages = calcDif > 0 ? calcPages + 1 : calcPages;
    }
    this.pagItems = [];
    for (let i = 0; i < totalPages; i++) {
      if (i === 0) {
        this.pagItems.push({
          pageNum: i + 1,
          active: true
        });
      } else {
        this.pagItems.push({
          pageNum: i + 1,
          active: false
        });
      }
    }
    this.pageArrows.right = this.pagItems.length < 11;
  }

  // Handling the pagination bar
  changePage(p: number): void {
    this.pagItems[this.currentPage - 1].active = false;
    this.currentPage = p;
    this.pagItems[this.currentPage - 1].active = true;
    this.pageArrows.left = this.currentPage === this.pagItems[0].pageNum;
    this.pageArrows.right = this.currentPage === this.pagItems[this.pagItems.length - 1].pageNum;
  }

  // Allows to search through all the date
  searchInAllTable(sValue: any): void {
    console.log(sValue);
    console.log(sValue.trim());
    if (sValue.length > 0) {
      const searchTable = [];
      this.tempMemberList.map(x => {
        this.tableHeader.some(value => {
          if (x[value.key] !== null) {
            x[value.key] = x[value.key].toString();
            if (x[value.key].toLowerCase() === sValue.toLowerCase().trim()) {
              searchTable.push(x);
              return true;
            }
          }
        });
      });
      this.membersList = searchTable;
      this.pagSize = this.membersList.length;
      this.setPagination();
    } else {
      this.membersList = [];
      this.membersList.push(...this.tempMemberList);
      this.pagSize = this.membersList.length;
      this.setPagination();
    }
  }

  // Allows to search on specific column
  searchByField(field, event): void {
    const sValue = event.target.value.trim();
    if (sValue.length > 0) {
      this.membersList = this.tempMemberList.filter(x => {
        x[field] = x[field].toString();
        return x[field].toLowerCase() === sValue.toLowerCase();
      });
      this.pagSize = this.membersList.length;
      this.setPagination();
    } else {
      this.membersList = [];
      this.membersList.push(...this.tempMemberList);
      this.pagSize = this.membersList.length;
      this.setPagination();
    }
  }

  ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properly.
    this.ngUnsubscribe.complete();
  }
}
