import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AppGemography';
  repositories: any[] = [];
  private currentPage = 1;
  private repositoriesCreationDate = '';
  isLoading = true;

  constructor(private httpClient: HttpClient, private datePipe: DatePipe, private logger: NGXLogger) {
    // Set repositories creation date
    const date = new Date(new Date().setDate(new Date().getDate() - 30));
    this.repositoriesCreationDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.loadRepositories();
  }

  private loadRepositories() {
    this.isLoading = true;
    this.getRepositories(
      this.repositoriesCreationDate,
      this.currentPage,
      (repositories) => {
        this.repositories = this.repositories.concat(repositories.items);
        this.logger.debug('Repositories has been retrieved successfully');
      },
      (error) => {
        this.logger.error(error);
      },
      () => {
        this.isLoading = false;
      });
  }

  private getRepositories(date: string, page: number,
                          successCallback: (repositories) => void,
                          errorCallback: (error) => void,
                          completeCallback: () => void) {
    const requestUrl = `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&page=${page}`;
    return this.httpClient.get(requestUrl).pipe(
      tap(() => {
        this.logger.debug(requestUrl);
      })
    ).subscribe((repositories: any[]) => {
      this.currentPage++;
      successCallback(repositories);
    }, (error) => {
      this.logger.error(error);
      errorCallback(error);
    }, () => {
      completeCallback();
    });
  }

  dateInterval(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(date.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  onScroll() {
    if (!this.isLoading) {
      this.loadRepositories();
    }
  }
}
