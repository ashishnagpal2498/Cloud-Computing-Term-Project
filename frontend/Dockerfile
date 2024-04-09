
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_ENVIRONMENT=production
ENV REACT_APP_FRONTEND_URL=localhost
ENV REACT_APP_BACKEND_URL=localhost

RUN npm run build

EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
