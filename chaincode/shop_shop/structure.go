
package main

type SimpleAsset	struct {}

////////////////////////////////////////////////////////////////////////////////
/// SHOP
////////////////////////////////////////////////////////////////////////////////
type ShopItem		struct {
	Name			string
	Price			uint64
	IsUnique		bool
	Quantity		uint64
	BidLimitDate	string
}

type ShopRaw		struct {
	Price			uint64
	Quantity		uint64
}

type ShopSold		struct {
	BuyerId			string
	ProductId		string
	Quantity		uint64
	Status			uint8
	Info			string
}

type Shop			struct {
	Name			string
	Users			map[string]bool
	Items			map[string]ShopItem
	Raw				map[string]ShopRaw
	SoldItems		map[string]ShopSold
	SoldRaw			map[string]ShopSold
}

////////////////////////////////////////////////////////////////////////////////
/// RAW
////////////////////////////////////////////////////////////////////////////////
type Raw			struct {
	Name			string
	Details			string
}

////////////////////////////////////////////////////////////////////////////////
/// USER
////////////////////////////////////////////////////////////////////////////////

type User			struct {
	Offers			map[string]map[string]uint64
}
