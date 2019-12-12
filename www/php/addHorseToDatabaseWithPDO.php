<?php

/*. require_module 'core'; .*/

/**
 * Palm (MySQL) Database.
 */
class Palm {

    /**
     * Constructor.
     */
    function __construct() {
        $this->isConnected = true;
        try {
            $username = "";
            $password = "";
            $this->d = new PDO( "mysql:host=;dbname=;charset=utf8;port=", $username, $password );
            $this->d->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
        } catch ( PDOException $e ) {
            $this->isConnected = false;
            $this->d = null;

            print_r( "<br/><br/>I guess this doesn't work on phpfiddle." );
        }
    }

    function destroy() {
        if ( $this->isConnected ) {
            //$this->d->query( "KILL CONNECTION_ID()" ); // This is important
            $this->d = null;
        }
    }
}

function addHorseToDatabase( $vars ) {
    print_r( $vars->name."<br/>" );
    print_r( $vars->breed."<br/>" );
    print_r( $vars->weight."<br/>" );
    print_r( $vars->height."<br/>" );
    print_r( $vars->age );

    $db = new Palm();

    $sql =<<<EOF
        INSERT INTO HORSE (Name, Breed, Height, Weight, Age) VALUES (:horsename, :horsebreed, :horseheight, :horseweight, :horseage);
EOF;

    $stmt = $db->d->prepare( $sql );

    $stmt->bindParam( ":horsename", $vars->name );
    $stmt->bindParam( ":horsebreed", $vars->breed );
    $stmt->bindParam( ":horseheight", $vars->height );
    $stmt->bindParam( ":horseweight", $vars->weight );
    $stmt->bindParam( ":horseage", $vars->age );

    $stmt->execute();
    
    $db->destroy();
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