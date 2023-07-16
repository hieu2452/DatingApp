import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {
  baseUrl = "http://localhost:5000/api/";
  validationError: string[] = []

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  get404Error() {
    this.http.get(this.baseUrl + "buggy/not-found").subscribe(
      {
        next: respone => console.log(respone),
        error: error => console.log(error)
      }
    );
  }

  get500Error() {
    this.http.get(this.baseUrl + "buggy/server-error").subscribe(
      {
        next: respone => console.log(respone),
        error: error => console.log(error)
      }
    );
  }

  get400Error() {
    this.http.get(this.baseUrl + "buggy/bad-request").subscribe(
      {
        next: respone => console.log(respone),
        error: error => console.log(error)
      }
    );
  }

  get401Error() {
    this.http.get(this.baseUrl + "buggy/auth").subscribe(
      {
        next: respone => console.log(respone),
        error: error => console.log(error)
      }
    );
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + "account/register", {}).subscribe(
      {
        next: respone => console.log(respone),
        error: error => {
          console.log(error);
          this.validationError = error;
        }
      }
    );
  }

}
