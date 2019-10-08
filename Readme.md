# TKBOT Node Back-End

## Table of Contents

[Getting Started](#Getting-Started)<br/>
  > [Scripts](#Scripts)<br/> 
  > [Environments](#Environments)

[End-Points](#End-Points)
  >[Slack Bot End-Points](#Slack-Bot-API)<br/>
    >1. [Slack Bot Main](#Slack-Bot-Main)
    >2. [Slack Bot Feedback](#Slack-Bot-Feedback)

  >[Search History End-Points](#Search-History-API)
    >1. [GET History by User ID](#GET-History-by-User-ID)
    >1. [GET History Notes by User ID](#GET-History-Notes-by-User-ID)
    >1. [GET History by ID](#Get-history-by-id)
    >1. [PUT Update History Note by ID](#put-update-hisotry-note-by-id)
    >1. [DEL History Note by ID](#del-history-note-by-id)
  
  >[Question End-points](#Question-api)
  
  >[Logs End-points](#logs-api)
    >1. [GET Request Logs](#get-request-logs)
    >1. [GET No Result Logs](#get-no-result-logs)
    >1. [GET Feedback logs](#get-feedback-logs)
  
  >[Auth End-points](#auth-api)

## Getting Started

### Scripts
| CMD                | ACTION                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm start`        | Runs the server by default on port 3000                                                                   |
| `npm run dev`      | Runs the server with nodemon to watch changes                                                             |
| `npm run tunnel`   | NGROK must be installed globally, this command will open up a https tunnel URL to your internal port 3000 |
| `npm test`         | Runs Jest unit tests                                                                                      |
| `npm run rollback` | Drops all tables in the connected Postgress server using `npx`                                            |
| `npm run migrate`  | Runs migrations on all tables in the connected Postgress server using `npx`                               |

---

### Environments
Both environments require you to make a slack bot in your workspace with a slash command pointed at the root endpoint. In the bot creation menu at `api.slack.com` you will find the `SLACK` secrets to store in your `.env` file.

#### Production
The database connection to the production db connection is handled by Heroku, and the `DATABASE_URL` gets populated by Heroku when you provision one for the application.
```
SLACK_AUTH_TOKEN=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_SIGNING_SECRET=
REDIRECT_URI=
DATABASE_URL=
DB_ENV=production
JWT_SECRET=
```

#### Local
When you run a Postgres server locally you will need to include a user, and password you set up while creating the local server.
```
SLACK_AUTH_TOKEN=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_SIGNING_SECRET=
REDIRECT_URI=
DATABASE_URL=
DB_ENV=development
DB_PASS=
DB_USER=
JWT_SECRET=
PORT=  optional - defaults to 3000
```

---

## End-points

### Slack Bot API

| METHOD | URL              | Requires                     | Description                           | Optional Queries      |
| ------ | ---------------- | :--------------------------: | ------------------------------------- | --------------------- |
| POST   | `/bot/`          | `question`                   | Slack bot root functionality          | none                  |
| POST   | `/bot/feedback`  | `slack interactive response` | Feedback end-point for slack bot      | none                  |

### Slack Bot Main 
### Slack Bot Feedback 

---
### Search History API

| METHOD | URL                                    | Requires                                           | Description                           | Optional Queries      |
| ------ | -------------------------------------- | :------------------------------------------------: | ------------------------------------- | --------------------- |
| GET    | `/api/history/`                        | `Web Token`                                        | Get a user's search history           | `?limit=20&offset=60` |
| GET    | `/api/history/notes`                   | `Web Token`                                        | List of the user's Notes              | `?limit=20&offset=60` |
| GET    | `/api/history/:history_id`             | `Search History id` ,`Web Token`                   | Get data on specific user history     | none                  |
| PUT    | `/api/history/update-note/:history_id` | `Search History id` ,`Web Token`, `notes`, `title` | Update a search history with a note   | none                  |
| PUT    | `/api/history/delete-note/:history_id` | `Search History id` ,`Web Token`                   | Delete a search history's note        | none                  |

### GET History by User ID
### GET History Notes by User ID 
### GET History by ID 
### PUT Update History Note by ID
### DEL History Note by ID

---

### Question API
---

### Logs API

| METHOD | URL                            | Requires | Description                           | Optional Queries      |
| ------ | ------------------------------ | :------: | ------------------------------------- | --------------------- |
| GET    | `/api/logs/requests`           | `none`   | Show request logs                     | `?limit=20&offset=60` |
| GET    | `/api/logs/nores`              | `none`   | Requests that we found no results for | `?limit=20&offset=60` |
| GET    | `/api/logs/feedback`           | `none`   | Collection of bot user feedback       | `?limit=20&offset=60` |

### GET Request Logs
### GET No Result Logs
### GET Feedback logs

---

### Auth API
---
