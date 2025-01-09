package com.hburak_dev.spaced_repetition_be.tag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {
  private final TagService tagService;

  @GetMapping
  public ResponseEntity<List<String>> getUserTags() {
    return ResponseEntity.ok(tagService.getUserTags());
  }
}