#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

LANGUAGE="golang"
MSC_CC_SRC_PATH=github.com/chaincode/MSC/
INVOICING_CC_SRC_PATH=github.com/chaincode/invoicing/
SHOP_USER_CC_SRC_PATH=github.com/chaincode/marketplace
set -e

	
### CC msc
	echo "central bank address :" $1
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n MSC -v 1.0 -p "$MSC_CC_SRC_PATH" -l "$LANGUAGE"
	
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C msline -n MSC -l "$LANGUAGE" -v 1.0 -c "{\"function\": \"$1\", \"Args\":[\"$1\", \"$1\", \"$2\"]}" -P "OR ('MEDSOSMSP.member')" 
	
	sleep 10

### CC invoicing
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n invoicing -v 1.0 -p "$INVOICING_CC_SRC_PATH" -l "$LANGUAGE"
	
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C msline -n invoicing -l "$LANGUAGE" -v 1.0 -c "{\"function\": \"$1\", \"Args\":[\"$1\", \"$1\"]}" -P "OR ('MEDSOSMSP.member')" 
	
	sleep 10

### CC shop user
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install -n marketplace -v 1.0 -p "$SHOP_USER_CC_SRC_PATH" -l "$LANGUAGE"
	
parsedkey="$(echo '[\"'"$1"'\"]')"
	docker exec -e "CORE_PEER_LOCALMSPID=MEDSOSMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C msline -n marketplace -l "$LANGUAGE" -v 1.0 -c "{\"Args\":[\"$parsedkey\"]}" -P "OR ('MEDSOSMSP.member')" 
	
	sleep 10
