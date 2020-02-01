import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {DatePipe} from '@angular/common';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  HttpClientModule, InfiniteScrollModule,
        LoggerModule.forRoot({serverLoggingUrl: '/api/logs',
          level: NgxLoggerLevel.DEBUG,
          serverLogLevel: NgxLoggerLevel.ERROR})
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        DatePipe
    ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('AppGemography');
  });

  it('Repositories have been loaded', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component.repositories).not.toBe([]);
  });
});
