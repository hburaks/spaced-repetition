package com.hburak_dev.spaced_repetition_be.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
  private Long id;
  private String email;
  private String fullName;
}