#     superscore request.js 0.3.0
#     (c) 2012 David Souther
#     superscore is freely distributable under the MIT license.
#     For all details and documentation:
#     https:#github.com/DavidSouther/superscore

let _ = underscore

	browserRequest = ->
		jQuery = if typeof jQuery is \undefined then null else jQuery
		# Ajax, through jQuery if possible.
		ajax = if jQuery then jQuery.ajax else (options)->
			d = _.Deferred!


			# Nice clean way to get an xhr
			XHR = window.ActiveXObject || XMLHttpRequest
			xhr = new XHR 'Microsoft.XMLHTTP'

			# Probably a GET requst, unless there is data or something else is specified.
			xhr.open (options.type || if options.data then 'POST' else 'GET'), options.url, true

			# Most likely sending text/plain
			if  'overrideMimeType' in xhr
				xhr.overrideMimeType options.dataType || 'text/plain'

			# Handle state changes.
			xhr.onreadystatechange = ->
				if  xhr.readyState === 4
					if ((_ref = xhr.status) === 0 || _ref === 200)
						# Resolve on success.
						resolution = xhr.responseText
						if options.dataType is "application/json"
							resolution = JSON.parse resolution
						d.resolve resolution
					else
						# Reject on failure.
						d.reject new Error "Could not load " + options.url
					return

				# Notify for any other events.
				d.notify xhr

			# We'll need to set headers to send the data.
			if options.data
				xhr.setRequestHeader "Content-type", options.dataType || "application/x-www-form-urlencoded"

			# Execute the request.
			xhr.send options.data || null

			# No need to return the entire XHR request.
			d.promise!


		# get(url[, options])
		# Shorthand for a GET request.

		get = if jQuery then jQuery.get else (url, options)->
			options = options || {}
			options.url = url
			options.type = 'GET'
			options.data = null
			ajax options

		# post(url[, options])
		# Shorthand for a POST request.

		post = if jQuery then jQuery.post else (url, options)->
			options = options || {}
			options.url = url
			options.type = 'POST'
			ajax options

		get: get
		post: post

	serverRequest = ->
		request = require 'request'
		get = (uri)->
			d = _.Deferred!
			request.get uri, (err, success, body)->
				d.resolve body
			d.promise!

		post = (uri, data)->
			d = _.Deferred!
			d.promise!

		get: get
		post: post

	if typeof window isnt \undefined # Uh oh, in the browser...
		request = browserRequest!
	else
		request = serverRequest!

	_.request = (uri)->
		d = _.Deferred!
		# Consistently handle "" for requests
		if uri is ""
			setTimeout (-> d.resolve ""), 0
		else
			_.request.get uri .then (-> d.resolve it)
		d.promise!

	_.request <<< request