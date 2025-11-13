# Etapa 1: Build del proyecto
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copiar configuraciones Maven y POM
COPY mvnw pom.xml ./
COPY .mvn/ .mvn/

# Descargar dependencias para acelerar builds futuros
RUN ./mvnw dependency:go-offline -B

# Copiar el resto del código fuente
COPY src ./src

# Compilar el proyecto
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen final para ejecutar
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar el JAR generado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto del backend
EXPOSE 8080

# Comando de ejecución
ENTRYPOINT ["java", "-jar", "app.jar"]
