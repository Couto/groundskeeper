TESTS = test/*.test.js
REPORTER = list

test:
	@NODE_ENV=TESTS ./node_modules/.bin/mocha \
		--ui exports \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov:
	@NODE_ENV=COVERAGE ./node_modules/.bin/mocha \
		--ui exports \
		--reporter html-cov \
		$(TESTS) > ./coverage/index.html \
		&& open ./coverage/index.html

lib-cov:
	@rm -rf coverage
	@jscoverage lib coverage

.PHONY: lib-cov test test-cov
