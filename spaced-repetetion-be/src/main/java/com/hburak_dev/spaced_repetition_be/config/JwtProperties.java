package com.hburak_dev.spaced_repetition_be.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "spring.security.jwt")
public class JwtProperties {
  private String secret;
  private long expiration;
}