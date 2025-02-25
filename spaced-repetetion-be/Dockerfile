FROM ghcr.io/graalvm/graalvm-ce:ol9-java17 as builder

WORKDIR /build
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
RUN ls -la target/*.jar

FROM ghcr.io/graalvm/graalvm-ce:ol9-java17

WORKDIR /app
COPY --from=builder /build/target/spaced-repetition-be-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"] 