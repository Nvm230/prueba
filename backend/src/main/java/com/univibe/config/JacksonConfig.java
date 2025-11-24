package com.univibe.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.build();
        
        // Configurar módulo de Hibernate 6 para manejar proxies lazy
        Hibernate6Module hibernateModule = new Hibernate6Module();
        // No forzar la carga lazy - simplemente serializar como null si no está inicializado
        hibernateModule.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, false);
        // No usar anotaciones @Transient
        hibernateModule.configure(Hibernate6Module.Feature.USE_TRANSIENT_ANNOTATION, false);
        // NO serializar el ID para objetos lazy no cargados - serializar como null
        hibernateModule.configure(Hibernate6Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS, false);
        // Reemplazar proxies no inicializados con null
        hibernateModule.configure(Hibernate6Module.Feature.REPLACE_PERSISTENT_COLLECTIONS, true);
        
        mapper.registerModule(hibernateModule);
        
        // Deshabilitar fallo en beans vacíos para evitar problemas con proxies
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        
        return mapper;
    }
}

