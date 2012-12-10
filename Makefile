TESTS = test/*.test.js
JSFILES = bin/* lib/*.js
JSONFILES = package.json

test:
	@clear
	@NODE_ENV=TESTS ./node_modules/.bin/mocha \
		--ui exports \
		--reporter spec \
		$(TESTS)

test-watch:
	@NODE_ENV=TESTS ./node_modules/.bin/mocha \
		--ui exports \
		--watch \
		--reporter min \
		$(TESTS)

test-cov:
	@$(MAKE) lib-cov
	@GROUNDSKEEPER_COVERAGE=1 ./node_modules/.bin/mocha \
		--ui exports \
		--reporter html-cov \
		$(TESTS) > ./coverage/index.html \
		&& open ./coverage/index.html

lib-cov:
	@rm -rf coverage/*
	@jscoverage lib coverage

.PHONY: lib-cov test test-cov
