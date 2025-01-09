package com.hburak_dev.spaced_repetition_be.user.dto;

public class StudyPreferencesDTO {
  private Integer cardsPerDay;
  private Boolean enableNotifications;
  private Boolean darkMode;

  public Integer getCardsPerDay() {
    return cardsPerDay;
  }

  public void setCardsPerDay(Integer cardsPerDay) {
    this.cardsPerDay = cardsPerDay;
  }

  public Boolean getEnableNotifications() {
    return enableNotifications;
  }

  public void setEnableNotifications(Boolean enableNotifications) {
    this.enableNotifications = enableNotifications;
  }

  public Boolean getDarkMode() {
    return darkMode;
  }

  public void setDarkMode(Boolean darkMode) {
    this.darkMode = darkMode;
  }
}