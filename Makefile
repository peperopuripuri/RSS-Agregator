install:
	npm ci
build:
	npm run-script build
lint:
	npx eslint .
lint fix:
	npx eslint . --fix