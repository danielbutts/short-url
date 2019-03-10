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
SKIP_PREFLIGHT_CHECK=true
```
* Create required tables with the following script (assumes database/user exists):
```
CREATE TABLE urls (
    url varchar(1000) NOT NULL,
    hash varchar(32) COLLATE pg_catalog."default" NOT NULL PRIMARY KEY,
    shorthash varchar(32) COLLATE pg_catalog."default" NOT NULL,
    createddtm timestamp DEFAULT now(),
    updatedttm timestamp DEFAULT now()
);
```

### Start the Server:
* ```npm run dev```

### Using the applicaiton:
* Browse to ```https://dbutts-short-url.herokuapp.com/```
* Enter a url and click submit
* To view previously created short URLs, click the 'Stats' button
* To use a shortened url, browse to ```https://dbutts-short-url.herokuapp.com/{short url}```

### Future work:
* Improved UI including refactor of React App.js into more manageable component/file structure
* Addition statistics (e.g. number of times a link has been used)
* Use Base-62 encoding instead of Base-64 to avoid less user friendly characters (e.g. + and /)
* More user friendly messaging on url creation (e.g. link in alert message)
