package com.hburak_dev.spaced_repetition_be.card.dto;

import java.util.List;

import lombok.Data;

@Data
public class CreateCardRequest {
  private String front;
  private String back;
  private List<String> tags;
}