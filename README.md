# Fibsync

A small Next.js dashboard for checking the current class status, timetable, and upcoming exams for the FIB student schedule.

You can see an example of a current deployed fibsync app [here](https://fibsync.vercel.app/)

## Requirements

- Node.js 20+
- pnpm
- A valid `FIB_API_CLIENT_ID` for the UPC exam API

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

3. Update `.env` with your API client ID:

```bash
FIB_API_CLIENT_ID=your_client_id
```

4. Update `app/data/schedules.json` with your desired schedules, you can find this in the [FIB API](https://api.fib.upc.edu/v2/jo/classes)

5. Update `app/data/events.json` with your desired events. An event follows the following structure:
```json
{
    "nom":"event-name",
    "type":"event-type", // free, usually laboratori, problemes, questionari...
    "assignatura":"event-subject", // if it is a FIB subject, it will grab its color
    "data": [
        {
            "grup": XX, // must be a number
            "dia": "2026-01-01"
        },
        {
            "grup": YY, // must be a number
            "dia": "2026-02-02"
        }
    ]
},
```

## Run locally

```bash
pnpm dev
```

Then open <http://localhost:3000>.

## Production build

```bash
pnpm build
pnpm start
```

The project is configured for a standalone Next.js build, which is suitable for containerized deployment or hosting platforms that prefer a production-ready output.

## Notes

- The app reads exam data from the FIB API.
- The timetable is backed by the local schedule data in `app/data/schedules.json`.
- The events are backed by the local event data in `app/data/events.json`
- The build is intended to be deployed with the environment variable set at runtime.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
