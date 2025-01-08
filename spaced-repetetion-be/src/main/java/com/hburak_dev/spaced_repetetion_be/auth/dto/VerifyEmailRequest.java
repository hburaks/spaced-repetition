package com.hburak_dev.spaced_repetetion_be.auth.dto;

import lombok.Data;

@Data
public class VerifyEmailRequest {
  private String code;
}