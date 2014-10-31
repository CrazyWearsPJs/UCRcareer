/**
 * Export settings for application
 */

module.exports = {
	dbSettings: {
		host:     "10.0.2.15"
	  , port:     "8081"
	  , database: "UCRcareers"
	}
  , serverSettings: {
        port:           "8080"
	  , httpErrLogFile: "HTTP.ERROR.log"
	  , httpLogFile:    "HTTP.log"
	  , appErrLogFile:  "APP.ERROR.log"
	  , appInfoLogFile: "APP.INFO.log"
	  , appWarnLogFile: "APP.WARN.log"
	}
};
