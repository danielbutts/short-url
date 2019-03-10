# URL Shortener
##### Created by Daniel Butts
* * *

## Description
This is a simple web application to create shortened URLs for easier use. The application persists original urls, their hashes, and associated metadata in a postgres database.

### How to install:

* Fork and clone the git repository
* Run `npm install` to install dependencies.
* Create a new `.env` file in the root directory of the project. The file should contian:

```
DB_USER={database user - e.g. 'admin'}
DB_HOST={host name - e.g. 'localhost'}
DB_NAME={database name - e.g. 'shortener'}
DB_PASSWORD={password - e.g. 'secret'}
DB_PORT={port number - typically 5432 for postgres}
PORT={application port - defaults to 3000}
```
* Create required tables with the following script (assumes database/user exists):

```
CREATE TABLE urls
(
    url character varying(1000) NOT NULL,
    shorthash character varying(32) NOT NULL,
    hash character varying(32) NOT NULL,
    createddtm timestamp without time zone DEFAULT now(),
    CONSTRAINT urls_pkey PRIMARY KEY (hash)
)
```

### Start the Server:
* ```npm run dev```

### Using the applicaiton:
* Browse to ```http://localhost:{port}/```
