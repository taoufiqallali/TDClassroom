FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Fix: Use 'mvn' instead of 'maven'
RUN mvn clean package

FROM openjdk:21-jdk-slim

VOLUME /springData

ARG JAR_FILE=target/TDClassroom-0.0.1-SNAPSHOT.jar

# Fix: Correct the ARG variable reference to ${JAR_FILE}
COPY --from=build /app/${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
