# Allocator Server

## Overview
This server is responsible for fetching unresolved events from the database and allocating them to available VoteReceiverServers.

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Set up the database with the `queue` table.
4. Configure the `.env` file with your database credentials and VoteReceiverServer URL.
5. Run the server with `npm start` or `npm run dev` (for development with nodemon).

## Endpoints
- `POST /allocator/allocate`: Allocate the next unresolved event to a VoteReceiverServer.

## License
MIT
