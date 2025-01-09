package com.hburak_dev.spaced_repetition_be.user.dto;

public class ProfileSettingsDTO {
  private String fullName;
  private String email;

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}