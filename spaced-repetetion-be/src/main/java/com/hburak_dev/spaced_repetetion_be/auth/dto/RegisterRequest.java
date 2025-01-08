package com.hburak_dev.spaced_repetetion_be.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {
  private String email;
  private String password;
  private String username;
}