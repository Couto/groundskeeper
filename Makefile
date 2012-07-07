TESTS = test/*.test.js
JSFILES = bin/* lib/*.js
JSONFILES = package.json

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

version:
	@sed -i '' 's/$(OLD_VERSION)/$(NEW_VERSION)/g' $$i $(shell ls $(JSFILES)) $(shell ls $(JSONFILES))

.PHONY: lib-cov test test-cov
