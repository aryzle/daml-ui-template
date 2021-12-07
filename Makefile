build:
	cd token && daml build
	cd token && daml codegen js -o daml.js .daml/dist/*.dar
	cd token && daml damlc visual .daml/dist/token-0.0.1.dar --dot token.dot
	cd token && dot -Tpng token.dot > token.png
	# cd setup && daml build 
	# cd triggers && daml build
	cd ui && yarn install
	cd ui && yarn build

rebuild:
	cd token && daml build
	cd token && daml codegen js -o daml.js .daml/dist/*.dar
	cd setup && daml build
	cd triggers && daml build
	cd ui && rm -rf node_modules/@daml*
	cd ui && yarn install --check-files

deploy: build
	mkdir -p deploy
	cp token/.daml/dist/*.dar deploy
	# cp txn-processing/.daml/dist/*/dar deploy
	cd ui && zip -r ../deploy/token-ui.zip build

clean:
	cd token && rm -rf .daml
	cd token && rm -rf token.dot
	cd token && rm -rf token.png
	cd token && rm -rf daml.js
	cd setup && rm -rf .daml
	cd triggers && rm -rf .daml
	rm -rf deploy
	cd ui && rm -rf build
	cd ui && rm -rf node_modules
	cd ui && rm -rf yarn.lock
