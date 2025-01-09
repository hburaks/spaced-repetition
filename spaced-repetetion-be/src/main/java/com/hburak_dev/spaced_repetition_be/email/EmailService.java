package com.hburak_dev.spaced_repetition_be.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;

  public void sendVerificationEmail(String to, String username, String verificationCode) {
    try {
      Context context = new Context();
      context.setVariable("fullName", username);
      context.setVariable("verificationCode", verificationCode);

      String htmlContent = templateEngine.process("verification-email", context);

      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
      helper.setTo(to);
      helper.setSubject("Verify your email");
      helper.setText(htmlContent, true);

      mailSender.send(message);
    } catch (MessagingException e) {
      throw new RuntimeException("Failed to send email", e);
    }
  }
}