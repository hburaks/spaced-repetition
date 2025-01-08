package com.hburak_dev.spaced_repetetion_be.auth;

import com.hburak_dev.spaced_repetetion_be.auth.dto.AuthResponse;
import com.hburak_dev.spaced_repetetion_be.auth.dto.UserDto;
import com.hburak_dev.spaced_repetetion_be.user.User;
import com.hburak_dev.spaced_repetetion_be.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthResponse register(String email, String password, String username) {
    var user = User.builder()
        .email(email)
        .username(username)
        .password(passwordEncoder.encode(password))
        .emailVerified(false)
        .verificationCode(generateVerificationCode())
        .build();

    userRepository.save(user);
    var token = jwtService.generateToken(user);
    return createAuthResponse(token, user);
  }

  public AuthResponse login(String email, String password) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(email, password));
    var user = userRepository.findByEmail(email)
        .orElseThrow();
    var token = jwtService.generateToken(user);
    return createAuthResponse(token, user);
  }

  public void verifyEmail(String code) {
    var user = userRepository.findByVerificationCode(code)
        .orElseThrow();
    user.setEmailVerified(true);
    user.setVerificationCode(null);
    userRepository.save(user);
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
            .username(user.getUsername())
            .build())
        .build();
  }
}