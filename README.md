# URL Shortener
##### Created by Daniel Butts
* * *

## Description
This is a simple web application to create shortened URLs for easier use. The application persists original urls, their hashes, and associated metadata in a postgres database.

## Design Considerations
#### React
* Although this application required very little UI, React was chosen as a front-end framework over other, lighter weight, frameworks or template engines like handlebars or EJS because it can be easily extended/customized in the future as an application inevitably grows over time.
* In a larger application or in a production the React application would be refactored into a more organized file strucutre and include custom components to provide a better user experience and improve managability.

#### React-Bootsrap
* React-Bootsrap was chosen for expedience to provide styled components without the overhead of building the manaully and in the absence of a custom component library.

#### Express Generator
* The Express Generator was used to quickly create the framework for a Node/Express api and serve static content for the React front end.

#### Create React App
* Similarly, Create React App was used to generate the template application without the overhead of manually building the app and configuring React/Babel/Webpack/etc.


## How to install:

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
