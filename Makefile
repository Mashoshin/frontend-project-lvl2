start:
	npx babel src --out-dir dist
publish:
	npm publish --dry -run
lint:
	npx eslint .
test:
	npm test
test-coverage:
	npm test -- --coverage 

