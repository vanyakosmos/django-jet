test:
	pytest

testcov:
	pytest --cov=jet --cov-report term-missing --cov-report xml

buildstatic:
	NODE_ENV=production gulp build

build: buildstatic
	poetry build -f sdist
