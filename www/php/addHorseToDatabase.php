<?php

function addHorseToDatabase( $vars ) {
    print_r( $vars->name."<br/>" );
    print_r( $vars->breed."<br/>" );
    print_r( $vars->weight."<br/>" );
    print_r( $vars->height."<br/>" );
    print_r( $vars->age );
    //... Add to database and stuff
    // PDO Statement will handle injection security.
}

function defaultv( $var, $isNum = false, $default = "" ) {
    if ( empty( $var ) ) {
        if ( $isNum == TRUE ) {
            $var = intval( trim( $default ) );
            if ( 0 > $var ) $var = "";
            return $var;
        }
        return trim( $default );
    } else {
        if ( $isNum == TRUE ) {
            $val = intval( trim( $var ) );
            if ( 0 > $var ) $var = "";
            return $val;
        }
        return trim( $var );
    }
}

function main() {
    $obj = new stdClass();
    $obj->action = defaultv( $_POST["action"] );
    $obj->name = defaultv( $_POST["name"] );
    $obj->breed = defaultv( $_POST["breed"] );
    $obj->height = defaultv( $_POST["height"], true );
    $obj->age = defaultv( $_POST["age"], true );
    $obj->weight = defaultv( $_POST["weight"], true );

    addHorseToDatabase( $obj );
}

$_POST["action"] = "Horse";
$_POST["name"] = "    Bojangles        "; // trim works
$_POST["breed"] = "Clydesdale";
$_POST["height"] = "17";
$_POST["weight"] = "757a$";
$_POST["age"] = "7";

main();

?>