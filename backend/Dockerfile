FROM maven:3.8.3-openjdk-17 AS springboot_build
COPY . /home/app
WORKDIR /home/app
ENV FRONTEND_URL=localhost
ENV S3_BUCKET_NAME=imagicon-bucket-uploads
ENV DYNAMODB_TABLE_NAME=user-images
RUN mvn -f /home/app/pom.xml clean install
RUN dir -s

FROM openjdk:17
LABEL authors="Ashish"
COPY --from=springboot_build /home/app/target/backend-imagicon.jar /app/backend-imagicon.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/backend-imagicon.jar"]