package com.lavoztica.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("*")        // o "http://127.0.0.1:5500" si sirves la página con Live Server
            .allowedMethods("GET","POST");
  }
}
