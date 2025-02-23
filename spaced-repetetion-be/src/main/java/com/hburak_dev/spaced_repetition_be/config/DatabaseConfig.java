package com.hburak_dev.spaced_repetition_be.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

  @Value("${DATABASE_URL}")
  private String databaseUrl;

  @Bean
  public DataSource dataSource() throws URISyntaxException {
    URI dbUri = new URI(databaseUrl);

    String username = dbUri.getUserInfo().split(":")[0];
    String password = dbUri.getUserInfo().split(":")[1];
    String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();

    return DataSourceBuilder.create()
        .url(jdbcUrl)
        .username(username)
        .password(password)
        .build();
  }
}