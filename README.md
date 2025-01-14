# Audio Transcription API

This NestJS application provides an API for transcribing audio files using OpenAI's Whisper API.

## Prerequisites

- Node.js (v16 or later)
- MySQL
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nestjs-transcription-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_URL=your_database_url
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=transcription_db
   JWT_SECRET=your_jwt-secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Create the MySQL database:
   ```sql
   CREATE DATABASE transcription_db;
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. The application will be available at:
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

## API Endpoints

### 1. Upload Audio for Transcription
- **POST** `/transcriptions/upload`
- Upload an audio file (mp3, wav, m4a, or ogg) for transcription
- Use form-data with key 'audio' and the file as value

### 2. List All Transcriptions
- **GET** `/transcriptions`
- Retrieve all transcriptions

### 3. Get Transcription by ID
- **GET** `/transcriptions/{id}`
- Retrieve a specific transcription by its ID

## Testing with Postman

1. Import the OpenAPI specification:
   - Open Postman
   - Click "Import" -> "API"
   - Enter URL: `http://localhost:3000/api-json`
   - Click "Continue" and "Import"

2. Test endpoints:
   - Use the imported collection
   - For file upload, use form-data and select an audio file
   - All endpoints will be available with proper request formatting

## Folder Structure

```
src/
├── transcription/
│   ├── transcription.controller.ts
│   ├── transcription.service.ts
│   ├── transcription.entity.ts
│   └── transcription.module.ts
├── app.module.ts
└── main.ts
```

## Error Handling

The API returns standard error responses:
- 400: Bad Request (e.g., invalid file format)
- 404: Not Found
- 500: Server Error

## Development

- Run tests: `npm test`
- Format code: `npm run format`
- Lint code: `npm run lint`

