let _ = underscore
	_.{}Event <<<
		## Eventing utility methods
		# Bind callback to object
		observe: !(source, callback) ->
				prep source
				source.__event_handler.push(callback)

		# Remove callback from object
		off: !(source, e) ->
				prep source
				if (t = source.__event_handler.indexOf(e)) > -1
					source.__event_handler[t to t] = []

		advise: !(source, advisor) ->
				prep source
				source.__event_advisor.push(advisor)

		unadvise: !(source, e) ->
				prep source
				if (t = source.__event_advisor.indexOf(e)) > -1
					source.__event_advisor[t to t] = []

		# Trigger callbacks for object.
		trigger: (source, e, p) ->
				prep source
				source.last = {event: e, exception: null}
				advisors = source.__event_advisor.length
				while (advisors -= 1) >= 0
					try
						_e = source.__event_advisor[advisors].call(p, e)
						if _e then source.last.event = e = _e # Advice *may*, not *must*, return an updated event trigger.
					catch ex
						source.last.exception = ex
						return false
				handlers = source.__event_handler.length
				while (handlers -= 1) >= 0
					source.__event_handler[handlers].call p, e
				true

	!function prep o
			o.__event_handler = o.__event_handler || []
			o.__event_advisor = o.__event_advisor || []

	function marshal ev
		->
			_.Event[ev].apply null, [@] ++ [].slice.call &

	@<<<
		observe$: marshal \observe
		off$: marshal \off
		advise$: marshal \advise
		unadvise$: marshal \unadvise
		trigger$: marshal \trigger
