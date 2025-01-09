package com.hburak_dev.spaced_repetition_be.auth;

import com.hburak_dev.spaced_repetition_be.auth.dto.AuthResponse;
import com.hburak_dev.spaced_repetition_be.auth.dto.LoginRequest;
import com.hburak_dev.spaced_repetition_be.auth.dto.RegisterRequest;
import com.hburak_dev.spaced_repetition_be.auth.dto.VerifyEmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
  private final AuthenticationService authenticationService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authenticationService.register(
        request.getEmail(),
        request.getPassword(),
        request.getFullName()));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(authenticationService.login(
        request.getEmail(),
        request.getPassword()));
  }

  @PostMapping("/verify-email")
  public ResponseEntity<AuthResponse> verifyEmail(@RequestBody VerifyEmailRequest request) {
    return ResponseEntity.ok(authenticationService.verifyEmail(request.getCode()));
  }
}