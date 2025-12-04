# 1. Build the App
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the backend code
COPY prescreen/pom.xml .
COPY prescreen/src ./src

# Copy the ALREADY BUILT frontend files (You must run 'npm run build' locally first!)
# This expects you to have copied client/dist to prescreen/src/main/resources/static
# as we did in the previous step.

# Build the JAR
RUN mvn clean package -DskipTests

# 2. Run the App
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]