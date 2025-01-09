import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileSettings {
  fullName: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfileSettings(): Observable<ProfileSettings> {
    return this.http.get<ProfileSettings>(`${this.apiUrl}/users/profile`);
  }

  updateProfileSettings(
    settings: ProfileSettings
  ): Observable<ProfileSettings> {
    return this.http.put<ProfileSettings>(
      `${this.apiUrl}/users/profile`,
      settings
    );
  }

  changePassword(passwordChange: PasswordChange): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/password`, passwordChange);
  }
}
