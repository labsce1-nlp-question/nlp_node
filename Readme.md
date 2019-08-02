# TKBOT

## Node Back End

### SCRIPTS
| CMD                | ACTION                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm start`        | Runs the server by default on port 3000                                                                   |
| `npm run dev`      | Runs the server with nodemon to watch changes                                                             |
| `npm run tunnel`   | NGROK must be installed globally, this command will open up a https tunnel URL to your internal port 3000 |
| `npm test`         | Runs Jest unit tests                                                                                      |
| `npm run rollback` | Drops all tables in the connected Postgress server using `npx`                                            |
| `npm run migrate`  | Runs migrations on all tables in the connected Postgress server using `npx`                               |

### ENDPOINTS

| METHOD | URL                  | Description                           | Optional Queries      |
| ------ | -------------------- | ------------------------------------- | --------------------- |
| POST   | `/`                  | Slack bot root functionality          | none                  |
| GET    | `/api/logs/requests` | Show request logs                     | `?limit=20&offset=60` |
| GET    | `/api/logs/nores`    | Requests that we found no results for | `?limit=20&offset=60` |
| GET    | `/api/logs/feedback` | Collection of bot user feedback       | `?limit=20&offset=60` |

---

### ENVIRONMENT
Both environments require you to make a slack bot in your workspace with a slash command pointed at the root endpoint. In the bot creation menu at `api.slack.com` you will find the `SLACK` secrets to store in your `.env` file.

#### PRODUCTION
The database connection to the production db connection is handled by Heroku, and the `DATABASE_URL` gets populated by Heroku when you provision one for the application.
```
SLACK_AUTH_TOKEN=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_VERIFICATION_TOKEN=
DATABASE_URL=
DB_ENV=production
```

#### LOCAL
When you run a Postgres server locally you will need to include a user, and password you set up while creating the local server.
```
SLACK_AUTH_TOKEN=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_VERIFICATION_TOKEN=
DATABASE_URL=
DB_ENV=development
DB_PASS=
DB_USER=
PORT=  optional - defaults to 3000
```