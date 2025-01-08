package com.hburak_dev.spaced_repetetion_be.card.dto;

import lombok.Data;
import java.util.Set;

@Data
public class CreateCardRequest {
  private String front;
  private String back;
  private Set<String> tags;
}