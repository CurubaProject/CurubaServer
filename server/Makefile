TESTS = test/*.js
REPORTER = list

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
		$(TESTS)

test-w :
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
      --watch \
		$(TESTS)

.PHONY: test bench
