import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap, lastValueFrom,catchError, of, BehaviorSubject } from 'rxjs';
import { Recipe, Comment, User, Image } from './models';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://localhost:4200/api';
  private recipes$: any = [];
  private user$: any;
  private comments$: Subject<Comment[]> = new Subject();
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);  // User state with BehaviorSubject
  private observableUser$: Observable<User | null> = this.userSubject.asObservable();  // Observable to subscribe to


  constructor(private httpClient: HttpClient) { }

  //Recipe handlers
  async getRecipes() {
    return await lastValueFrom(this.httpClient.get(`${this.url}/recipes`));
  }

  getRecipe(id: string) {
    return this.httpClient.get<Recipe>(`${this.url}/recipes/${id}`);
  }

  createRecipe(recipe: Recipe): Observable<string> {
    return this.httpClient.post(`${this.url}/recipes`, recipe, { responseType: 'text' });
  }

  updateRecipe(id: string, recipe: Recipe): Observable<string> {
    return this.httpClient.put(`${this.url}/recipes/${id}`, recipe, { responseType: 'text' });
  }

  deleteRecipe(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/recipes/${id}`, { responseType: 'text' });
  }

  //User handlers
  async isLoggedIn(): Promise<void> {
    try {
      const userResponse = await lastValueFrom(
        this.httpClient.get(`${this.url}/user`).pipe(
          catchError((error) => {
            console.error('Error loading user:', error);
            return of(null); // Return `null` on error to allow the app to continue
          })
        )
      );

      // If the user data is received, set it
      if (userResponse) {
        this.user$ = userResponse;
        this.setUserInfo(userResponse as User);
      } else {
        this.user$ = null; // No user data, so set user$ to null
      }
    } catch (error) {
      console.error('Error during API request:', error);
      this.user$ = null; // Set user$ to null if the request fails
    }
  }

  getUser(){
    // console.log("getUSER");
    // console.log(`${this.user$}`);
    return this.user$;
  }

  getUserInfo() {
    return this.observableUser$;
  }

  registerUser(user:User): Observable<any>{
    return this.httpClient.post(`${this.url}/user/register`, user, {responseType: 'text'});
  }

  login(user:User): Observable<any>{
    // return this.httpClient.post(`${this.url}/user/login`, user, {responseType: 'text'});
    return this.httpClient.post(`${this.url}/user/login`, user, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Login error', error);
        return of(null); // Return null if login fails
      })
    );
  }

  logout():Observable<any>{
    return this.httpClient.get(`${this.url}/user/logout`);
  }

  // Set user data after login
  setUserInfo(user: User | null) {
    this.userSubject.next(user);  // Update the user subject
  }

  updateUser(id: string, user: User): Observable<any> {
    return this.httpClient.put(`${this.url}/user/${id}`, user, { responseType: 'text' });
  }

  //Comment Handllers
  getComments(id: string): Observable<any>{
    return this.httpClient.get(`${this.url}/comments/${id}`);
  }

  createComment(comment: Comment): Observable<string> {
    return this.httpClient.post(`${this.url}/comments`, comment, { responseType: 'text' });
  }

  updateComment(id: string, comment: Comment): Observable<string> {
    return this.httpClient.put(`${this.url}/comments/${id}`, comment, { responseType: 'text' });
  }

  //Image Handlers
  createImage(image: any): Observable<any> {
    return this.httpClient.post(`${this.url}/image`, image, {responseType: 'text'});
  }

  editImage(id: string, image: any): Observable<any> {
    return this.httpClient.put(`${this.url}/image/${id}`, image, {responseType: 'text'});
  }

  upvoteImg(id:string, image:any): Observable<any> {
    return this.httpClient.put(`${this.url}/image/upvotes/${id}`, image, {responseType: 'text'});
  }

  deleteImage(id: string, image: any): Observable<any> {
    const httpOptions = {
      body: image
    };
    return this.httpClient.delete(`${this.url}/image/${id}`, httpOptions);
  }
}
