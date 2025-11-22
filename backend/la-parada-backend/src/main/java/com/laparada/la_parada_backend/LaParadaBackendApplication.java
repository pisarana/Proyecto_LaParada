package com.laparada.la_parada_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class LaParadaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LaParadaBackendApplication.class, args);
	}

}
