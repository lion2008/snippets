/*
	curl-to-Go
	by Matt Holt

	https://github.com/mholt/curl-to-go

	A simple utility to convert curl commands into Go code.
*/

function curlToGo(curl) {
	var err = 'if err != nil {\n\t// handle err\n}\n';
	var deferClose = 'defer resp.Body.Close()\n';
	var promo = "// Generated by curl-to-Go: https://mholt.github.io/curl-to-go";

	// List of curl flags that are boolean typed; this helps with parsing
	// a command like `curl -abc value` to know whether 'value' belongs to '-c'
	// or is just a positional argument instead.
	var boolOptions = ['#', 'progress-bar', '-', 'next', '0', 'http1.0', 'http1.1', 'http2',
		'no-npn', 'no-alpn', '1', 'tlsv1', '2', 'sslv2', '3', 'sslv3', '4', 'ipv4', '6', 'ipv6',
		'a', 'append', 'anyauth', 'B', 'use-ascii', 'basic', 'compressed', 'create-dirs',
		'crlf', 'digest', 'disable-eprt', 'disable-epsv', 'environment', 'cert-status',
		'false-start', 'f', 'fail', 'ftp-create-dirs', 'ftp-pasv', 'ftp-skip-pasv-ip',
		'ftp-pret', 'ftp-ssl-ccc', 'ftp-ssl-control', 'g', 'globoff', 'G', 'get',
		'ignore-content-length', 'i', 'include', 'I', 'head', 'j', 'junk-session-cookies',
		'J', 'remote-header-name', 'k', 'insecure', 'l', 'list-only', 'L', 'location',
		'location-trusted', 'metalink', 'n', 'netrc', 'N', 'no-buffer', 'netrc-file',
		'netrc-optional', 'negotiate', 'no-keepalive', 'no-sessionid', 'ntlm', 'O',
		'remote-name', 'oauth2-bearer', 'p', 'proxy-tunnel', 'path-as-is', 'post301', 'post302',
		'post303', 'proxy-anyauth', 'proxy-basic', 'proxy-digest', 'proxy-negotiate',
		'proxy-ntlm', 'q', 'raw', 'remote-name-all', 's', 'silent', 'sasl-ir', 'S', 'show-error',
		'ssl', 'ssl-reqd', 'ssl-allow-beast', 'ssl-no-revoke', 'socks5-gssapi-nec', 'tcp-nodelay',
		'tlsv1.0', 'tlsv1.1', 'tlsv1.2', 'tr-encoding', 'trace-time', 'v', 'verbose', 'xattr',
		'h', 'help', 'M', 'manual', 'V', 'version'];

	if (!curl.trim())
		return;
	var cmd = parseCommand(curl, { boolFlags: boolOptions });

	if (cmd._[0] != "curl")
		throw "Not a curl command";

	var req = extractRelevantPieces(cmd);

	if (Object.keys(req.headers).length == 0 && !req.data.ascii && !req.data.files && !req.basicauth && !req.insecure) {
		return promo+"\n"+renderSimple(req.method, req.url);
	} else {
		return promo+"\n\n"+renderComplex(req);
	}


	// renderSimple renders a simple HTTP request using net/http convenience methods
	function renderSimple(method, url) {
		if (method == "GET")
			return 'resp, err := http.Get('+goExpandEnv(url)+')\n'+err+deferClose;
		else if (method == "POST")
			return 'resp, err := http.Post('+goExpandEnv(url)+', "", nil)\n'+err+deferClose;
		else if (method == "HEAD")
			return 'resp, err := http.Head('+goExpandEnv(url)+')\n'+err+deferClose;
		else
			return 'req, err := http.NewRequest('+goExpandEnv(method)+', '+goExpandEnv(url)+', nil)\n'+err+'resp, err := http.DefaultClient.Do(req)\n'+err+deferClose;
	}

	// renderComplex renders Go code that requires making a http.Request.
	function renderComplex(req) {
		var go = "";

		// init client name
		var clientName = "http.DefaultClient";

		// insecure
		// -k or --insecure
		if (req.insecure) {
			go += '// TODO: This is insecure; use only in dev environments.\n';
			go += 'tr := &http.Transport{\n' +
				'        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},\n' +
				'    }\n' +
				'    client := &http.Client{Transport: tr}\n\n';

			clientName = "client";
		}

		// load body data
		// KNOWN ISSUE: -d and --data are treated like --data-binary in
		// that we don't strip out carriage returns and newlines.
		var defaultPayloadVar = "body";
		if (!req.data.ascii && !req.data.files) {
			// no data; this is easy
			go += 'req, err := http.NewRequest("'+req.method+'", '+goExpandEnv(req.url)+', nil)\n'+err;
		} else {
			var ioReaders = [];

			// if there's text data...
			if (req.data.ascii) {
				var stringBody = function() {
					if (req.dataType == "raw" ) {
						go += defaultPayloadVar+' := strings.NewReader("'+req.data.ascii.replace(/\"/g, "\\\"") +'")\n'
					} else {
						go += defaultPayloadVar+' := strings.NewReader(`'+req.data.ascii+'`)\n'
					}
					ioReaders.push(defaultPayloadVar);
				}

				if (req.headers["Content-Type"] && req.headers["Content-Type"].indexOf("json") > -1) {
					// create a struct for the JSON
					var result = jsonToGo(req.data.ascii, "Payload");
					if (result.error)
						stringBody(); // not valid JSON, so just treat as a regular string
					else if (result.go) {
						// valid JSON, so create a struct to hold it
						go += result.go+'\n\ndata := Payload {\n\t// fill struct\n}\n';
						go += 'payloadBytes, err := json.Marshal(data)\n'+err;
						go += defaultPayloadVar+' := bytes.NewReader(payloadBytes)\n\n';
					}
				} else {
					// not a json Content-Type, so treat as string
					stringBody();
				}
			}

			// if file data...
			if (req.data.files && req.data.files.length > 0) {
				var varName = "f";
				for (var i = 0; i < req.data.files.length; i++) {
					var thisVarName = (req.data.files.length > 1 ? varName+(i+1) : varName);
					go += thisVarName+', err := os.Open('+goExpandEnv(req.data.files[i])+')\n'+err;
					go += 'defer '+thisVarName+'.Close()\n';
					ioReaders.push(thisVarName);
				}
			}

			// render go code to put all the data in the body, concatenating if necessary
			var payloadVar = defaultPayloadVar;
			if (ioReaders.length > 0)
				payloadVar = ioReaders[0];
			if (ioReaders.length > 1) {
				payloadVar = "payload";
				// KNOWN ISSUE: The way we separate file and ascii data values
				// loses the order between them... our code above just puts the
				// ascii values first, followed by the files.
				go += 'payload := io.MultiReader('+ioReaders.join(", ")+')\n';
			}
			go += 'req, err := http.NewRequest("'+req.method+'", '+goExpandEnv(req.url)+', '+payloadVar+')\n'+err;
		}

		// set basic auth
		if (req.basicauth) {
			go += 'req.SetBasicAuth('+goExpandEnv(req.basicauth.user)+', '+goExpandEnv(req.basicauth.pass)+')\n';
		}

		// if a Host header was set, we need to specify that specially
		// (see the godoc for the http.Request.Host field) - issue #15
		if (req.headers["Host"]) {
			go += 'req.Host = "'+req.headers["Host"]+'"\n';
			delete req.headers["Host"];
		}

		// set headers
		for (var name in req.headers) {
			go += 'req.Header.Set('+goExpandEnv(name)+', '+goExpandEnv(req.headers[name])+')\n';
		}

		// execute request
		go += "\nresp, err := "+clientName+".Do(req)\n";
		go += err+deferClose;

		return go;
	}

	// extractRelevantPieces returns an object with relevant pieces
	// extracted from cmd, the parsed command. This accounts for
	// multiple flags that do the same thing and return structured
	// data that makes it easy to spit out Go code.
	function extractRelevantPieces(cmd) {
		var relevant = {
			url: "",
			method: "",
			headers: [],
			data: {},
			dataType: "string",
			insecure: false
		};

		// prefer --url over unnamed parameter, if it exists; keep first one only
		if (cmd.url && cmd.url.length > 0)
			relevant.url = cmd.url[0];
		else if (cmd._.length > 1)
			relevant.url = cmd._[1]; // position 1 because index 0 is the curl command itself

		// gather the headers together
		if (cmd.H)
			relevant.headers = relevant.headers.concat(cmd.H);
		if (cmd.header)
			relevant.headers = relevant.headers.concat(cmd.header);
		relevant.headers = parseHeaders(relevant.headers)

		// set method to HEAD?
		if (cmd.I || cmd.head)
			relevant.method = "HEAD";

		// between -X and --request, prefer the long form I guess
		if (cmd.request && cmd.request.length > 0)
			relevant.method = cmd.request[cmd.request.length-1].toUpperCase();
		else if (cmd.X && cmd.X.length > 0)
			relevant.method = cmd.X[cmd.X.length-1].toUpperCase(); // if multiple, use last (according to curl docs)
		else if (cmd["data-binary"] && cmd["data-binary"].length > 0) {
			relevant.method = "POST"; // if data-binary, user method POST
			relevant.dataType = "raw"; // if data-binary, post body will be raw
		}

		// join multiple request body data, if any
		var dataAscii = [];
		var dataFiles = [];
		var loadData = function(d) {
			if (!relevant.method)
				relevant.method = "POST";

			// according to issue #8, curl adds a default Content-Type
			// header if one is not set explicitly
			if (!relevant.headers["Content-Type"])
				relevant.headers["Content-Type"] = "application/x-www-form-urlencoded";

			for (var i = 0; i < d.length; i++)
			{
				if (d[i].length > 0 && d[i][0] == "@")
					dataFiles.push(d[i].substr(1));
				else
					dataAscii.push(d[i]);
			}
		};
		if (cmd.d)
			loadData(cmd.d);
		if (cmd.data)
			loadData(cmd.data);
		if (cmd["data-binary"])
			loadData(cmd["data-binary"]);
		if (dataAscii.length > 0)
			relevant.data.ascii = dataAscii.join("&");
		if (dataFiles.length > 0)
			relevant.data.files = dataFiles;

		// between -u and --user, choose the long form...
		var basicAuthString = "";
		if (cmd.user && cmd.user.length > 0)
			basicAuthString = cmd.user[cmd.user.length-1];
		else if (cmd.u && cmd.u.length > 0)
			basicAuthString = cmd.u[cmd.u.length-1];
		// if the -u or --user flags haven't been set then don't set the
		// basicauth property.
		if (basicAuthString) {
			var basicAuthSplit = basicAuthString.indexOf(":");
			if (basicAuthSplit > -1) {
				relevant.basicauth = {
					user: basicAuthString.substr(0, basicAuthSplit),
					pass: basicAuthString.substr(basicAuthSplit+1)
				};
			} else {
				// the user has not provided a password
				relevant.basicauth = { user: basicAuthString, pass: "<PASSWORD>" };
			}
		}

		// default to GET if nothing else specified
		if (!relevant.method)
			relevant.method = "GET";

		if (cmd.k || cmd.insecure) {
			relevant.insecure = true;
		}

		return relevant;
	}

	// parseHeaders converts an array of header strings (like "Content-Type: foo")
	// into a map of key/values. It assumes header field names are unique.
	function parseHeaders(stringHeaders) {
		var headers = {};
		for (var i = 0; i < stringHeaders.length; i++) {
			var split = stringHeaders[i].indexOf(":");
			if (split == -1) continue;
			var name = stringHeaders[i].substr(0, split).trim();
			var value = stringHeaders[i].substr(split+1).trim();
			headers[toTitleCase(name)] = value;
		}
		return headers;
	}

	function toTitleCase(str) {
		return str.replace(/\w*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	// goExpandEnv adds surrounding quotes around s to make it a Go string,
	// escaping any characters as needed. It checks to see if s has an
	// environment variable in it. If so, it returns s wrapped in a Go
	// function that expands the environment variable. Otherwise, it
	// returns s wrapped in quotes and escaped for use in Go strings.
	// s should not already be escaped! This function always returns a Go
	// string value.
	function goExpandEnv(s) {
		var pos = s.indexOf("$");
		if (pos > -1)
		{
			if (pos > 0 && s[pos-1] == '\\') {
				// The $ is escaped, so strip the escaping backslash
				s = s.substr(0, pos-1) + s.substr(pos);
			} else {
				// $ is not escaped, so treat it as an env variable
				return 'os.ExpandEnv("'+goEsc(s)+'")';
			}
		}
		return '"'+goEsc(s)+'"';
	}

	// goEsc escapes characters in s so that it is safe to use s in
	// a "quoted string" in a Go program
	function goEsc(s) {
		return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	}
}


function parseCommand(input, options) {
	if (typeof options === 'undefined') {
		options = {};
	}

	var result = {_: []}, // what we return
	    cursor = 0,       // iterator position
	    token = "";       // current token (word or quoted string) being built

	// trim leading $ or # that may have been left in
	input = input.trim();
	if (input.length > 2 && (input[0] == '$' || input[0] == '#') && whitespace(input[1]))
		input = input.substr(1).trim();

	for (cursor = 0; cursor < input.length; cursor++) {
		skipWhitespace();
		if (input[cursor] == "-") {
			flagSet();
		} else {
			unflagged();
		}
	}

	return result;




	// flagSet handles flags and it assumes the current cursor
	// points to a first dash.
	function flagSet() {
		// long flag form?
		if (cursor < input.length-1 && input[cursor+1] == "-") {
			return longFlag();
		}

		// if not, parse short flag form
		cursor++; // skip leading dash
		while (cursor < input.length && !whitespace(input[cursor]))
		{
			var flagName = input[cursor];
			if (typeof result[flagName] == 'undefined') {
				result[flagName] = [];
			}
			cursor++; // skip the flag name
			if (boolFlag(flagName))
				result[flagName] = true;
			else if (Array.isArray(result[flagName]))
				result[flagName].push(nextString());
		}
	}

	// longFlag consumes a "--long-flag" sequence and
	// stores it in result.
	function longFlag() {
		cursor += 2; // skip leading dashes
		var flagName = nextString("=");
		if (boolFlag(flagName))
			result[flagName] = true;
		else {
			if (typeof result[flagName] == 'undefined') {
				result[flagName] = [];
			}
			if (Array.isArray(result[flagName])) {
				result[flagName].push(nextString());
			}
		}
	}

	// unflagged consumes the next string as an unflagged value,
	// storing it in the result.
	function unflagged() {
		result._.push(nextString());
	}

	// boolFlag returns whether a flag is known to be boolean type
	function boolFlag(flag) {
		if (Array.isArray(options.boolFlags)) {
			for (var i = 0; i < options.boolFlags.length; i++) {
				if (options.boolFlags[i] == flag)
					return true;
			}
		}
		return false;
	}

	// nextString skips any leading whitespace and consumes the next
	// space-delimited string value and returns it. If endChar is set,
	// it will be used to determine the end of the string. Normally just
	// unescaped whitespace is the end of the string, but endChar can
	// be used to specify another end-of-string. This function honors \
	// as an escape character and does not include it in the value, except
	// in the special case of the \$ sequence, the backslash is retained
	// so other code can decide whether to treat as an env var or not.
	function nextString(endChar) {
		skipWhitespace();

		var str = "";

		var quoted = false,
			quoteCh = "",
			escaped = false;
		quoteDS = false; // Dollar-Single-Quotes

		for (; cursor < input.length; cursor++) {
			if (quoted) {
				if (input[cursor] == quoteCh && !escaped && input[cursor -1] != "\\") {
					quoted = false;
					continue;
				}
			}
			if (!quoted) {
				if (!escaped) {
					if (whitespace(input[cursor])) {
						return str;
					}
					if (input[cursor] == '"' || input[cursor] == "'") {
						quoted = true;
						quoteCh = input[cursor];
						if (str + quoteCh == "$'") {
							quoteDS = true
							str = ""
						}
						cursor++;
					}
					if (endChar && input[cursor] == endChar) {
						cursor++; // skip the endChar
						return str;
					}
				}
			}
			if (!escaped && !quoteDS && input[cursor] == "\\") {
				escaped = true;
				// skip the backslash unless the next character is $
				if (!(cursor < input.length-1 && input[cursor+1] == '$'))
					continue;
			}

			str += input[cursor];
			escaped = false;
		}

		return str;
	}

	// skipWhitespace skips whitespace between tokens, taking into account escaped whitespace.
	function skipWhitespace() {
		for (; cursor < input.length; cursor++) {
			while (input[cursor] == "\\" && (cursor < input.length-1 && whitespace(input[cursor+1])))
				cursor++;
			if (!whitespace(input[cursor]))
				break;
		}
	}

	// whitespace returns true if ch is a whitespace character.
	function whitespace(ch) {
		return ch == " " || ch == "\t" || ch == "\n" || ch == "\r";
	}
}