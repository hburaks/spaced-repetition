package com.hburak_dev.spaced_repetition_be.auth.dto;

import lombok.Data;

@Data
public class VerifyEmailRequest {
  private String code;
}