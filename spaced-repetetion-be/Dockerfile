FROM eclipse-temurin:17-jdk-alpine as builder
WORKDIR /app
# Copy Maven wrapper files first for better layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# Download dependencies first (cached layer)
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline
# Then copy source and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"] 


#docker buildx build --platform linux/amd64 -t hburak-dev/spaced-repetition-be:latest .
#docker push hburak-dev/spaced-repetition-be:latest