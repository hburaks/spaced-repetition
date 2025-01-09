package com.hburak_dev.spaced_repetition_be.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {
  private String email;
  private String password;
}