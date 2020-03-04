test:
	pytest

testcov:
	pytest --cov=jet --cov-report term-missing --cov-report xml
