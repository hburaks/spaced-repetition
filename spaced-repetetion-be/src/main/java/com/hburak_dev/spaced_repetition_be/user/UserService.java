package com.hburak_dev.spaced_repetition_be.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.hburak_dev.spaced_repetition_be.user.dto.ProfileSettingsDTO;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import com.hburak_dev.spaced_repetition_be.user.dto.PasswordChangeDTO;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public ProfileSettingsDTO getProfileSettings(String username) {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    ProfileSettingsDTO dto = new ProfileSettingsDTO();
    dto.setFullName(user.getFullName());
    dto.setEmail(user.getEmail());
    return dto;
  }

  public ProfileSettingsDTO updateProfileSettings(String username, ProfileSettingsDTO settings) {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    user.setFullName(settings.getFullName());
    userRepository.save(user);

    return settings;
  }

  public void changePassword(String username, PasswordChangeDTO passwordChange) {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // Verify current password
    if (!passwordEncoder.matches(passwordChange.getCurrentPassword(), user.getPassword())) {
      throw new BadCredentialsException("Current password is incorrect");
    }

    // Update password
    user.setPassword(passwordEncoder.encode(passwordChange.getNewPassword()));
    userRepository.save(user);
  }
}