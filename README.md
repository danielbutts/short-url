# URL Shortener
##### Created by Daniel Butts
* * *

## Description
This is a simple web application to create shortened URLs for easier use. The application persists original urls, their hashes, and associated metadata in a postgres database.

## Design Considerations
### URL Shortening Strategy
Generating the short URL takes six steps:
1) Order query parameters alphabetically to ensure only urls with different parameters are treated as unique
2) Hash the full url (including ordered query parameters) with MD5. Although not the fastest, MD5 produces a reletaviely short (32 character) hash and negligable collision probablity. Security flaws of MD5 are not important for a not cryptographic application like URL shortening.
3) Base-64 encode the URL to shorten the hash without data loss and translate into a set of user friendly characters. The exception being '+' and '/' (any padding characters '=' are stripped). '/' characters are replaced with '.' to avoid issues of URL-part matching by express when the short url is used. Ideally, the hash would be base-62 encoded to avoid the use of non-alphanumeric characters in the short URLs entirely (future work).
4) Shorten the hash to a ideal length for usability using a substring (in this case 8 characters).
5) Validate uniqueness of the short hash in the pesistence layer and increase if needed to ensure all short urls are unique and as short as possible. This allows most short urls to be user friendly, but ensures the system could scale well beyond expected usage.
6) Persist the original URL, the full hash, the short hash, and the current time (as created and updated date) in the persistence layer

### URL Expiry
* If a short URL is not used within the last 14 days, it is considered expired and a user will not be redirected to the original URL.
* Whenever a shortened URL is used (if it is still valid), the updated date is reset in the database.
* If the same URL is re-shortened, the update date is reset to now even if the URL was previously considered expired, but the create date is not adjusted. This preserves the history of the urls original creation (albeit in a limited way).

## Technologies
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
* Additional statistics (e.g. number of times a link has been used)
* Use Base-62 encoding instead of Base-64 to avoid less user friendly characters (e.g. + and /)
* More user friendly messaging on url creation (e.g. link in alert message)
