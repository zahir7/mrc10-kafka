package	main

////////////////////////////////////////////////////////////////////////////////
/// STATIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/// PUBLIC FUNCTION
////////////////////////////////////////////////////////////////////////////////

func	isShopAdmin(shop Shop, userKey string) (bool) {
	var	i	int

	for i = range shop.Users {
		if shop.Users[i] == userKey {
			return true
		}
	}
	return false
}

//func	isShopAdmin(userKey string, shopId string) (User, bool, error) {
//	var	err		error
//	var	user	User
//	var	isIn	bool
//
//	user, err = getUser(userKey)
//	if err != nil {
//		return user, false, err
//	}
//	_, isIn = user.Shops[shopId]
//	return user, isIn, nil
//	//var shopUid string
//
//	//for _, shopUid = range usr.Shops {
//	//	if shopUid == shopId {
//	//		return true, nil
//	//	}
//	//}
//	//return false, nil
//}
//
