<?php
// Start the session
session_start();
if (!isset($_SESSION["username"]))
{

$newURL = "login.php";
header('Location: '.$newURL);
}
else
{
//print_r($_SESSION);

}
?>
<?php

//print_r($_POST);

include "settings.php";

$channel = "msline";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/buy_item");

	$ShopId = $_POST["shop"];
	$pid = $_POST["pid"];
	$qtty	 = $_POST["qtt"];

$jsobj = '{"ShopId" : "'.$ShopId.'", "ItemId" : "'.$pid.'", "Quantity" : '.$qtty.'}';

    //echo "OBJ=".$jsobj;
//print_r($_POST);
    /*
	Bidable				bool
	Picture				string
	Name				string
	Detail				string
	Price				uint64
	Quantity			uint64
    Duration			uint64
    */

$arf = $jsobj;
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            "X-request-username: $login",
            "X-request-password: $password",
            "params: $arf"
        ));

// In real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS, 
//          http_build_query(array('postvar1' => 'value1')));

// Receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

//echo $server_output;

//echo $server_output;

curl_close ($ch);

$resp = json_decode($server_output, true);

//print_r($resp);

$newURL = "manage_boug.php?shop=".$_POST['shop']."&n=".$_POST['name'];
header('Location: '.$newURL);

?>