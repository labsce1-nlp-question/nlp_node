# TK-BOT Node Back-End

## How to add TK-Bot to your Slack Workspace

Looking to add this Slack bot to your workspace? [click here to add it](https://slack.com/oauth/authorize?client_id=689534831568.698834298644&scope=commands,bot)

## Table of Contents

[Getting Started](#Getting-Started)<br/>
  > [Local Slack bot for testing](#Local-Slack-bot-for-testing)<br/>
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
  >1. [PUT Update History Note by ID](#put-update-history-note-by-id)
  >1. [DELETE History Note by ID](#delete-history-by-id)
  
  >[Question End-points](#Question-api)
  >1. [Send Question](#send-question)
  
  >[Logs End-points](#logs-api)
  >1. [GET No Result Logs](#get-no-result-logs)
  >1. [GET Feedback logs](#get-feedback-logs)
  
  >[Auth End-points](#auth-api)
  >1. [Add Bot to workspace](#add-bot-to-workspace-end-point)
  >1. [Slack App Redirect](#slack-app-redirect-end-point)

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

### Local Slack bot for testing

If you want to test the Slack Bot locally follow these steps:

1. Create a Slack App [here](https://api.slack.com/apps)
1. Create a Bot user in your Slack App
1. Set up your Slash Command with your NGROK url. ex: `https://7ce09a56.ngrok.io/bot`
1. Enable interactive messages in your Slack App with the feedback end-point. ex: `https://7ce09a56.ngrok.io/bot/feedback`
1. Set up your Redirect URL in your slack app for webapp login or bot distrubtion. ex: `http://localhost:3000/api/auth/redirect`

That's it! Your slack bot is now created and ready to be used locally! Be sure to add the correct values to your .ENV file from your slack app basic info page.

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

Method: **[POST]** `/bot/`

On Success: Sends user a list of links from Training Kit as a whisper in the channel the did the slash command from on slack. This will also store the question the user asked in the postgres database.

![alt text](https://i.imgur.com/dxxOYbP.png "example image")

Note: This End-point should be where your slack app slash command points to. If a request comes from anywhere but slack the request will not go through.

### Slack Bot Feedback 

Method: **[POST]** `/bot/feedback`

On Success: Sends user a 'Thank you for your feedback!' message where the option select button was in the original slack message to the user. This will also log the feedback from the user to the postgres database.

![alt text](https://i.imgur.com/JtHnCip.png "example image")

Note: This End-point should be where your slack app Interactive Message points to. 

---
### Search History API

| METHOD | URL                                    | Requires                                           | Description                           | Optional Queries      |
| ------ | -------------------------------------- | :------------------------------------------------: | ------------------------------------- | --------------------- |
| GET    | `/api/history/`                        | `Web Token`                                        | Get a user's search history           | `?limit=20&offset=60` |
| GET    | `/api/history/notes`                   | `Web Token`                                        | List of the user's Notes              | `?limit=20&offset=60` |
| GET    | `/api/history/:history_id`             | `Search History id` ,`Web Token`                   | Get data on specific user history     | none                  |
| PUT    | `/api/history/update-note/:history_id` | `Search History id` ,`Web Token`, `notes`, `title` | Update a search history with a note   | none                  |
| DELETE    | `/api/history/:history_id` | `Search History id` ,`Web Token`                   | Delete a search history's note        | none                  |

### GET History by User ID

Method: **[GET]** `/api/history/`

Expects header: 
```Javascript
{
  Authorization: WebToken
}
```
On Success: Returns a List of the Search History the user has made with the Slack Bot/Webapp
```Javascript
[
    {
        "user_id": "ULBBFQZ8M",
        "question": "what can you tell me about html",
        "bot_response": {
            "match_type": "full search",
            "similarity_metrics": "jaccard",
            "match": [
                {
                    "id": "reclfCBukV5561dm0",
                    "name": "Semantic HTML",
                    "description": "HTML tags have meaning. To use HTML effectively, we need to understand tags' meanings and how, when, and why we use them. This endeavor is called Semantic HTML.",
                    "URL": "https://learn.lambdaschool.com/ux/module/reclfCBukV5561dm0"
                },
                {
                    "id": "reccbhyB8uMh92l4A",
                    "name": "Personal Narrative",
                    "description": "Your personal narrative is the foundation of your portfolio and job hunt. It's how you present and communicate yourself to the world. \nYou'll spend this module better understanding what it is and how you can create your own.",
                    "URL": "https://learn.lambdaschool.com/ux/module/reccbhyB8uMh92l4A"
                },
                {
                    "id": "recLUSnDdsNLigtr3",
                    "name": "Responsive CSS I",
                    "description": "Responsive design describes the particular design challenge we face when designing for digital screens that need to support a variety of devices. To best support the variety of devices, we need to ensure that our designs are flexible and responsive so they work in each of these various contexts.",
                    "URL": "https://learn.lambdaschool.com/ux/module/recLUSnDdsNLigtr3"
                }
            ]
        },
        "time": "2019-10-04T22:52:12.400Z",
        "notes": null,
        "id": 234,
        "time_updated_at": null,
        "title": null
    },
    ...
]
```

### GET History Notes by User ID 

Method: **[GET]** `/api/history/notes/`

Expects header: 
```Javascript
{
  Authorization: WebToken
}
```

On Success: Returns a List of Search History that have had **Notes** added to them
```Javascript
[
    {
        "user_id": "ULBYSMZ5M",
        "question": ".map",
        "bot_response": {
            "match_type": "full search",
            "similarity_metrics": "cosine",
            "match": [
                {
                    "id": "recGzuI2ojm8ttDso",
                    "name": "MapKit",
                    "description": "NO_DESCRIPTION",
                    "URL": "https://learn.lambdaschool.com/ios/module/recGzuI2ojm8ttDso"
                },
                {
                    "id": "recIUCASspRm557rQ",
                    "name": "Location Based Services",
                    "description": "NO_DESCRIPTION",
                    "URL": "https://learn.lambdaschool.com/android/module/recIUCASspRm557rQ"
                },
                {
                    "id": "recmtN5zGW6KkaFcO",
                    "name": "Journey Maps",
                    "description": "NO_DESCRIPTION",
                    "URL": "https://learn.lambdaschool.com/ux/module/recmtN5zGW6KkaFcO"
                }
            ]
        },
        "time": "2019-10-03T21:42:31.157Z",
        "notes": "something here",
        "id": 187,
        "time_updated_at": "2019-10-04T20:20:26.456Z",
        "title": "this is a title for a note"
    },
    ...
]
```

### GET History by ID 

Method: **[GET]** `/api/history/:history_id`

Expects header: 
```Javascript
{
  Authorization: WebToken
}
```

Parameters:

| Name       | Type    | Required |
| ---------- | ------- | -------- |
| history_id | integer | yes      |

On Success: Returns the Search History object 
```Javascript
{
    "user_id": "UHGFFMZ5M",
    "question": "what can you tell me about html",
    "bot_response": {
        "match_type": "full search",
        "similarity_metrics": "jaccard",
        "match": [
            {
                "id": "recjOlkir00OYI1HB",
                "name": "Tell Your Story: How to Create an Effective Elevator Pitch",
                "description": "NO_DESCRIPTION",
                "URL": "https://learn.lambdaschool.com/cr/module/recjOlkir00OYI1HB"
            },
            {
                "id": "reccbhyB8uMh92l4A",
                "name": "Personal Narrative",
                "description": "Your personal narrative is the foundation of your portfolio and job hunt. It's how you present and communicate yourself to the world. \nYou'll spend this module better understanding what it is and how you can create your own.",
                "URL": "https://learn.lambdaschool.com/ux/module/reccbhyB8uMh92l4A"
            },
            {
                "id": "recLUSnDdsNLigtr3",
                "name": "Responsive CSS I",
                "description": "Responsive design describes the particular design challenge we face when designing for digital screens that need to support a variety of devices. To best support the variety of devices, we need to ensure that our designs are flexible and responsive so they work in each of these various contexts.",
                "URL": "https://learn.lambdaschool.com/ux/module/recLUSnDdsNLigtr3"
            }
        ]
    },
    "time": "2019-10-04T22:52:12.400Z",
    "notes": null,
    "id": 234,
    "time_updated_at": null,
    "title": null
}
```

### PUT Update History Note by ID

Method: **[PUT]** `/api/history/update-note/:history_id`

Expects header: 
```Javascript
{
  Authorization: WebToken
}
```

Parameters:

| Name       | Type    | Required |
| ---------- | ------- | -------- |
| history_id | integer | yes      |

Expects Body: 
```Javascript
{
  title: string,
  notes: string
}
```

Note: The body expects either a title or notes. One of the other is required or you can send both.

On Success: Returns the Search History object with the newly updated notes/title
```Javascript
{
    "user_id": "UHGFFMZ5M",
    "question": "what can you tell me about html",
    "bot_response": {
        "match_type": "full search",
        "similarity_metrics": "jaccard",
        "match": [
            {
                "id": "recjOlkir00OYI1HB",
                "name": "Tell Your Story: How to Create an Effective Elevator Pitch",
                "description": "NO_DESCRIPTION",
                "URL": "https://learn.lambdaschool.com/cr/module/recjOlkir00OYI1HB"
            },
            {
                "id": "reccbhyB8uMh92l4A",
                "name": "Personal Narrative",
                "description": "Your personal narrative is the foundation of your portfolio and job hunt. It's how you present and communicate yourself to the world. \nYou'll spend this module better understanding what it is and how you can create your own.",
                "URL": "https://learn.lambdaschool.com/ux/module/reccbhyB8uMh92l4A"
            },
            {
                "id": "recLUSnDdsNLigtr3",
                "name": "Responsive CSS I",
                "description": "Responsive design describes the particular design challenge we face when designing for digital screens that need to support a variety of devices. To best support the variety of devices, we need to ensure that our designs are flexible and responsive so they work in each of these various contexts.",
                "URL": "https://learn.lambdaschool.com/ux/module/recLUSnDdsNLigtr3"
            }
        ]
    },
    "time": "2019-10-04T22:52:12.400Z",
    "notes": "something here",
    "id": 234,
    "time_updated_at": "2019-10-11T20:21:04.106Z",
    "title": "Worthy title here"
}
```

### DELETE History by ID

Method: **[DELETE]** `/api/history/:history_id`

Expects header: 
```Javascript
{
  Authorization: WebToken
}
```

Parameters:

| Name       | Type    | Required |
| ---------- | ------- | -------- |
| history_id | integer | yes      |

On Success: Deletes the Search History from the database

---

### Question API

| METHOD  | URL                            | Requires     | Description                              | Optional Queries      |
| ------- | ------------------------------ | :----------: | ---------------------------------------- | --------------------- |
| POST    | `/api/question/`               | `question`   | Sends question from webapp to python API | `none`                |

### Send Question

Method: **[POST]** `/api/question`

Expects header: 
```Javascript
{
  Authorization: WebToken
}
```

Expects Body: 
```Javascript
{
  question: string
}
```

On Success: Returns a List of results from the Python API 
```Javascript
[
    {
        "id": "recGzuI2ojm8ttDso",
        "name": "MapKit",
        "description": "NO_DESCRIPTION",
        "URL": "https://learn.lambdaschool.com/ios/module/recGzuI2ojm8ttDso"
    },
    {
        "id": "recIUCASspRm557rQ",
        "name": "Location Based Services",
        "description": "NO_DESCRIPTION",
        "URL": "https://learn.lambdaschool.com/android/module/recIUCASspRm557rQ"
    },
    {
        "id": "recmtN5zGW6KkaFcO",
        "name": "Journey Maps",
        "description": "NO_DESCRIPTION",
        "URL": "https://learn.lambdaschool.com/ux/module/recmtN5zGW6KkaFcO"
    }
]
```

---

### Logs API

| METHOD | URL                            | Requires | Description                           | Optional Queries      |
| ------ | ------------------------------ | :------: | ------------------------------------- | --------------------- |
| GET    | `/api/logs/nores/`             | `none`   | Requests that we found no results for | `?limit=20&offset=60` |
| GET    | `/api/logs/feedback/`          | `none`   | Collection of bot user feedback       | `?limit=20&offset=60` |

### GET No Result Logs

Method: **[GET]** `/api/logs/nores/`

On Success: Returns all logs of python api requests that return no results in the Database

### GET Feedback logs

Method: **[GET]** `/api/logs/feedback/`

On Success: Returns all logs of feedback sent from users in the Database
```Javascript
[
    {
        "id": 43,
        "time": "2019-09-16T23:12:06.539Z",
        "question": "web .map",
        "bot_response": [
            {
                "id": "receOMvCB7dSyX5FL",
                "URL": "https://learn.lambdaschool.com/web3/module/receOMvCB7dSyX5FL",
                "name": "Deploying Web Apps",
                "description": "Learn how to deploy a web application with ZEIT"
            },
            {
                "id": "recGzuI2ojm8ttDso",
                "URL": "https://learn.lambdaschool.com/ios/module/recGzuI2ojm8ttDso",
                "name": "MapKit",
                "description": "NO_DESCRIPTION"
            },
            {
                "id": "recIUCASspRm557rQ",
                "URL": "https://learn.lambdaschool.com/android/module/recIUCASspRm557rQ",
                "name": "Location Based Services",
                "description": "NO_DESCRIPTION"
            }
        ],
        "user_response": false,
        "body": {
            "team": {
                "id": "QL2FGQAGQ",
                "domain": "tkbot"
            },
            "type": "interactive_message",
            "user": {
                "id": "HHAJFMZ5M",
                "name": "modesto"
            },
            "token": "9pShpcBXqCBC9oarAdtTasd234K",
            "actions": [
                {
                    "name": "Feedback",
                    "type": "select",
                    "selected_options": [
                        {
                            "value": "{\"question\":\"web .map\",\"search_res\":[{\"id\":\"receOMvCB7dSyX5FL\",\"name\":\"Deploying Web Apps\",\"description\":\"Learn how to deploy a web application with ZEIT\",\"URL\":\"https://learn.lambdaschool.com/web3/module/receOMvCB7dSyX5FL\"},{\"id\":\"recGzuI2ojm8ttDso\",\"name\":\"MapKit\",\"description\":\"NO_DESCRIPTION\",\"URL\":\"https://learn.lambdaschool.com/ios/module/recGzuI2ojm8ttDso\"},{\"id\":\"recIUCASspRm557rQ\",\"name\":\"Location Based Services\",\"description\":\"NO_DESCRIPTION\",\"URL\":\"https://learn.lambdaschool.com/android/module/recIUCASspRm557rQ\"}],\"positive_res\":false,\"match_type\":\"full search\",\"similarity_metrics\":\"cosine\"}"
                        }
                    ]
                }
            ],
            "channel": {
                "id": "GGA0RB5Q9",
                "name": "privategroup"
            },
            "action_ts": "1568675525.294544",
            "message_ts": "1568675523.002500",
            "trigger_id": "788853885971.6895344511268.8f5cc1dc4d0539a7f1d5d50a432348bb",
            "callback_id": "feedback_selection",
            "response_url": "https://hooks.slack.com/actions/",
            "attachment_id": "1",
            "is_app_unfurl": false
        },
        "match_type": "full search",
        "similarity_metrics": "cosine"
    },
    ...
]
```

---

### Auth API

| METHOD | URL                   | Requires          | Description                                                                         | Optional Queries      |
| ------ | ----------------------| :---------------: | ----------------------------------------------------------------------------------- | --------------------- |
| GET    | `/api/auth/`          | `none`            | Add the slack bot to your workspace                                                 | `none`                |
| GET    | `/api/auth/redirect/` | `slack request`   | End-point for slack bot to point to for interactive message/for logging into webapp | `none`                |


### Add Bot to workspace End-point

Method: **[GET]**

On Success: Returns an HTML File that will allow you to add the slack bot to your workspace

### Slack App Redirect End-point

Method: **[GET]**

Note: This end-point is used for OAuth 2.0 with Slack. It is needed for distribution as well as for logging in with slack
for the webapp. 

On Success: Authenticates that the user is logging in with their slack info via OAuth 2.0 with slack and returns the users acct info. If not logging into the webapp with Slack it will verify that the user is using their slack account to add the bot to the appropriate workspace.

---
