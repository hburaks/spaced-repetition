package com.hburak_dev.spaced_repetition_be.user;

import com.hburak_dev.spaced_repetition_be.user.dto.ProfileSettingsDTO;
import com.hburak_dev.spaced_repetition_be.user.dto.PasswordChangeDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/profile")
  public ResponseEntity<ProfileSettingsDTO> getProfileSettings(Authentication authentication) {
    ProfileSettingsDTO settings = userService.getProfileSettings(authentication.getName());
    return ResponseEntity.ok(settings);
  }

  @PutMapping("/profile")
  public ResponseEntity<ProfileSettingsDTO> updateProfileSettings(
      Authentication authentication,
      @RequestBody ProfileSettingsDTO settings) {
    ProfileSettingsDTO updated = userService.updateProfileSettings(authentication.getName(), settings);
    return ResponseEntity.ok(updated);
  }

  @PutMapping("/password")
  public ResponseEntity<Void> changePassword(
      Authentication authentication,
      @RequestBody PasswordChangeDTO passwordChange) {
    userService.changePassword(authentication.getName(), passwordChange);
    return ResponseEntity.ok().build();
  }
}