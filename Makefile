TESTS = test/*.test.js

test:
	@NODE_ENV=TESTS ./node_modules/.bin/mocha \
		--ui exports \
		--reporter list \
		$(TESTS)

test-watch:
	@NODE_ENV=TESTS ./node_modules/.bin/mocha \
		--ui exports \
		--watch \
		--reporter min \
		$(TESTS)

test-cov:
	@$(MAKE) lib-cov
	@NODE_ENV=COVERAGE ./node_modules/.bin/mocha \
		--ui exports \
		--reporter html-cov \
		$(TESTS) > ./coverage/index.html \
		&& open ./coverage/index.html

lib-cov:
	@rm -rf coverage/*
	@jscoverage lib coverage

.PHONY: lib-cov test test-cov
