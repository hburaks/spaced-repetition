package com.hburak_dev.spaced_repetition_be.card.dto;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class CreateCardRequest {
  private String front;
  private String back;
  private List<String> tags;
}