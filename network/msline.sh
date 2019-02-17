#!/usr/bin/env bash

C_RED="\033[31;01m"
C_GREEN="\033[32;01m"
C_YELLOW="\033[33;01m"
C_BLUE="\033[34;01m"
C_PINK="\033[35;01m"
C_CYAN="\033[36;01m"
C_NO="\033[0m"

################################################################################
###                                FUNCTIONS                                 ###
################################################################################

function usage {
	echo "./msline.sh [init]"
	echo "./msline.sh [up]"
	echo "./msline.sh [deploy] [address of total_supply owner]"
	echo "./msline.sh [down]"
	echo "./msline.sh [upgrade] [version]"
	echo "./msline.sh [install] [version]"
}

################################################################################
###                                   MAIN                                   ###
################################################################################

if [ $1 ]; then
	case "$1" in
		"init" )
			. ./script/init.sh ;;
		"up" )
			./script/up.sh ;;
		"upgrade" )
			./script/upgrade.sh $2;;
		"install" )
			./script/install.sh $2;;
		"deploy" )
			./script/deploy.sh $2 $3;;
		"down" )
			./script/down.sh ;;
		* )
			usage
	esac
else
	usage
fi
