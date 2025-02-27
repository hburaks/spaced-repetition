package com.hburak_dev.spaced_repetition_be.auth;

import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hburak_dev.spaced_repetition_be.auth.dto.AuthResponse;
import com.hburak_dev.spaced_repetition_be.auth.dto.UserDto;
import com.hburak_dev.spaced_repetition_be.email.EmailService;
import com.hburak_dev.spaced_repetition_be.exception.AuthenticationException;
import com.hburak_dev.spaced_repetition_be.security.JwtService;
import com.hburak_dev.spaced_repetition_be.user.Role;
import com.hburak_dev.spaced_repetition_be.user.User;
import com.hburak_dev.spaced_repetition_be.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final EmailService emailService;

  public AuthResponse register(String email, String password, String fullName) {
    var existingUser = userRepository.findByEmail(email);

    if (existingUser.isPresent()) {
      User user = existingUser.get();
      if (user.isEmailVerified()) {
        throw new RuntimeException("Email already registered. Please login.");
      } else {
        // Update verification code and resend email
        user.setVerificationCode(generateVerificationCode());
        userRepository.save(user);
        emailService.sendVerificationEmail(email, fullName, user.getVerificationCode());

        return AuthResponse.builder()
            .user(UserDto.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build())
            .requiresVerification(true)
            .build();
      }
    }

    var user = User.builder()
        .email(email)
        .password(passwordEncoder.encode(password))
        .fullName(fullName)
        .emailVerified(false)
        .verificationCode(generateVerificationCode())
        .role(Role.USER)
        .build();

    userRepository.save(user);
    emailService.sendVerificationEmail(email, fullName, user.getVerificationCode());

    return AuthResponse.builder()
        .user(UserDto.builder()
            .email(user.getEmail())
            .fullName(user.getFullName())
            .build())
        .requiresVerification(true)
        .build();
  }

  public AuthResponse login(String email, String password) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(email, password));

      var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthenticationException("User not found"));

        if (!user.isEnabled()) {
          throw new AuthenticationException("Please verify your email first");
        }

        var token = jwtService.generateToken(user);
        return createAuthResponse(token, user);
      } catch (BadCredentialsException e) {
        throw new AuthenticationException("Invalid email or password");
      } catch (Exception e) {
        throw new AuthenticationException("Authentication failed: " + e.getMessage());
      }
  }

  public AuthResponse verifyEmail(String code) {
    var user = userRepository.findByVerificationCode(code)
        .orElseThrow(() -> new RuntimeException("Invalid verification code"));

    user.setEmailVerified(true);
    user.setVerificationCode(null);
    userRepository.save(user);

    // Generate token only after email verification
    var token = jwtService.generateToken(user);
    return createAuthResponse(token, user);
  }

  private String generateVerificationCode() {
    Random random = new Random();
    return String.format("%06d", random.nextInt(1000000));
  }

  private AuthResponse createAuthResponse(String token, User user) {
    return AuthResponse.builder()
        .token(token)
        .user(UserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .build())
        .requiresVerification(false)
        .build();
  }
}