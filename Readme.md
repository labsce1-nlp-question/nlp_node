Experimental slackbot based on the Brad Traversy tutorial.

You will need to run:
npm i -g localtunnel
lt --port 8765 --subdomain [insert your bot name]

Then run your bot code:
npm start

Requests to smodibot1 look like:
```{ client_msg_id: 'cd7e55aa-9dc4-4340-9a64-4e6173461969',
  suppress_notification: false,
  type: 'message',
  text: '<@ULES3CC68> hi',
  user: 'ULBBFMZ5M',
  team: 'TL9FQQFGQ',
  user_team: 'TL9FQQFGQ',
  source_team: 'TL9FQQFGQ',
  channel: 'CL9FQQR7A',
  event_ts: '1563234695.004800',
  ts: '1563234695.004800' }```

