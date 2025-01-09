package com.hburak_dev.spaced_repetition_be.tag;

import com.hburak_dev.spaced_repetition_be.user.User;
import com.hburak_dev.spaced_repetition_be.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TagService {
  private final TagRepository tagRepository;
  private final UserService userService;

  public List<String> getUserTags() {
    try {
      return tagRepository.findAllByUser(userService.getCurrentUser())
          .stream()
          .map(Tag::getName)
          .distinct()
          .sorted()
          .collect(Collectors.toList());
    } catch (Exception e) {
      return Collections.emptyList();
    }
  }

  public void deleteOrphanedTags() {
    User currentUser = userService.getCurrentUser();
    List<Tag> orphanedTags = tagRepository.findOrphanedTags(currentUser);
    tagRepository.deleteAll(orphanedTags);
  }
}