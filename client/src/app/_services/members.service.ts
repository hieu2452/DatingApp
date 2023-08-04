import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';
import { PaginationResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberChe = new Map();

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams) {

    const response = this.memberChe.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = this.getPaginationHeader(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    console.log(userParams.orderBy)
    return this.getPaginationResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memberChe.set(Object.values(userParams).join('-'), response)
        return response;
      })
    );
  }

  private getPaginationResult<T>(url: string, params: HttpParams) {

    const paginatedResult: PaginationResult<T> = new PaginationResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }

  getMember(username: string) {
    const member = [...this.memberChe.values()].reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    );
  }
  updateMemberTest(member: Member, id: number) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const i = this.members.findIndex(x => x.id == id);
        this.members[i] = { ...this.members[i], ...member }
      })
    );
  }

  setMainPhoto(photoId: Number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: Number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

}
