# upload-rate-limiter

This application is a Node.js API designed to simulate rate limiting of file uploads. Unlike standard request-counting rate limiting, this API limits upload rate based on request size.

## Quick Start

Requires `node` and `redis`

```
git clone https://github.com/ethandjay/upload-rate-limiter
cd upload-rate-limiter
npm install
npm start
```

## Testing

Start the application with `npm start`, and in a separate shell, run:
```
npm test
```

## Specification

The API expects a `POST` request against `/upload` with header:
```
"Content-type": "application/json; charset=UTF-8",
```
and `JSON` body:
```
{
    "fileData": "Base64EncodedBinaryGoesHere=="
}
```