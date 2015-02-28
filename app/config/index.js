/**
 * Export settings for application
 */

module.exports = {
    dbSettings: {
      host:     process.env.DB_HOST || "192.168.0.15"
  	, port:     process.env.DB_PORT || "27017"
  	, database: process.env.DB_NAME || "TestUCRcareers"
    }
  , serverSettings: {
      port:           process.env.PORT || "8080"
  	, httpErrLogFile: "HTTP.ERROR.log"
  	, httpLogFile:    "HTTP.log"
  	, appErrLogFile:  "APP.ERROR.log"
  	, appInfoLogFile: "APP.INFO.log"
  	, appWarnLogFile: "APP.WARN.log"
  	, staticPath:     "site"
    , resumePath:     "/opt/resumes"
  }
  , bcryptSettings: {
	    hashRounds: 10
    }
};

