/**
 * Export settings for application
 */

module.exports = {
	dbSettings: {
	    host:     "10.0.2.15"
	  , port:     "8081"
	  , database: "UCRcareers"
	}
  , dbTestSettings: {
        host:     "10.0.2.15"
      , port:     "8081"
      , database: "TestUCRcareers"
    }
  , serverSettings: {
        port:           "8080"
	  , httpErrLogFile: "HTTP.ERROR.log"
	  , httpLogFile:    "HTTP.log"
	  , appErrLogFile:  "APP.ERROR.log"
	  , appInfoLogFile: "APP.INFO.log"
	  , appWarnLogFile: "APP.WARN.log"
      , staticPath:     "site"
	}
  , bcryptSettings: {
        hashRounds: 10
    }
};

