#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

LANGUAGE="golang"
CC_SRC_PATH=github.com/chaincode/marketplace
CC_NAME=marketplace
set -e

docker exec \
	-e "CORE_PEER_LOCALMSPID=MEDSOSMSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode install \
	-n "$CC_NAME" \
	-v $1 \
	-p "$CC_SRC_PATH" \
	-l "$LANGUAGE"

pubkey="$(cat ../../centralbank_pubkey.txt)";
	
docker exec \
	-e "CORE_PEER_LOCALMSPID=MEDSOSMSP" \
	-e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/MEDSOS.example.com/users/Admin@MEDSOS.example.com/msp" cli peer chaincode upgrade \
	-o orderer.example.com:7050 \
	-C msline \
	-n "$CC_NAME" \
	-l "$LANGUAGE" \
	-v $1 \
	-c '{"Args":["[\"'"$pubkey"'\"]"]}' \
	-P "OR ('MEDSOSMSP.member')"
	
