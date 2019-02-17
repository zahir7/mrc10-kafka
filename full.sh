cd ./nodejs-server-server
./build_container.sh
cd ../webservices
./build_container.sh
cd ../network
./msline.sh init
./msline.sh up
docker exec api.MEDSOS.example.com node create_db.js
docker exec api.MEDSOS.example.com node enrollAdmin.js
cbkey="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/centralbank' | jq -r '.pubkey')"
echo "central bank user address :${cbkey}"
echo "${cbkey}" > ../centralbank_pubkey.txt
./msline.sh deploy $cbkey $1

