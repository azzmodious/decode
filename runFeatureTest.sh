export URL="http://localhost:8080"
./node_modules/.bin/cucumber.js -r features/step_definitions/ -r features/support/ -t ~@ignore
unset URL