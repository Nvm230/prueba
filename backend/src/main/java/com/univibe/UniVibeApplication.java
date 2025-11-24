package com.univibe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.univibe")
@EntityScan(basePackages = "com.univibe")
@EnableJpaRepositories(basePackages = "com.univibe")
public class UniVibeApplication {
    public static void main(String[] args) {
        SpringApplication.run(UniVibeApplication.class, args);
    }
}
