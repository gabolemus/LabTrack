# LabTrack Backend

## File structure

- [`dist/`](dist/): will serve as the output folder once the typescript code is compiled to plain JavaScript.

- [`src/`](src/): will contains the logic of our API.
  - [`app.ts`](src/app.ts) is the entry point of the server.
  - [`controllers/`](src/controllers/): will contain functions that handle requests and return data from the model to the client
  - [`models/`](src/models/): will contain objects that will allow basic manipulations with our database.
  - [`routes/`](src/routes/): are used to forward the requests to the appropriate controller.
  - [`types/`](src/types/) will contain the interface of our objects in this project.
