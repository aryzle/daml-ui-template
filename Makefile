build:
	cd brokerage && daml build
	cd brokerage && daml codegen js -o daml.js .daml/dist/*.dar
	cd brokerage && daml damlc visual .daml/dist/brokerage-0.0.1.dar --dot brokerage.dot
	cd brokerage && dot -Tpng brokerage.dot > brokerage.png
	cd setup && daml build 
	cd triggers && daml build
	cd ui && yarn install
	cd ui && yarn build

rebuild:
	cd brokerage && daml build
	cd brokerage && daml codegen js -o daml.js .daml/dist/*.dar
	cd setup && daml build
	cd triggers && daml build
	cd ui && rm -rf node_modules/@daml*
	cd ui && yarn install --check-files

deploy: build
	mkdir -p deploy
	cp brokerage/.daml/dist/*.dar deploy
	cp txn-processing/.daml/dist/*/dar deploy
	cd ui && zip -r ../deploy/brokerage-ui.zip build

clean:
	cd brokerage && rm -rf .daml
	cd brokerage && rm -rf brokerage.dot
	cd brokerage && rm -rf brokerage.png
	cd brokerage && rm -rf daml.js
	cd setup && rm -rf .daml
	cd triggers && rm -rf .daml
	rm -rf deploy
	cd ui && rm -rf build
	cd ui && rm -rf node_modules
	cd ui && rm -rf yarn.lock
