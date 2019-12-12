<?php

    /*. require_module 'core'; .*/
    /*. require_module 'hash'; .*/
    /*. require_module 'json'; .*/

    $log = date( "Y-m-d @ g:i:s A" )." - Starting Neight 0.0.1<br/>";

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
                $username = ""; // See package sent to you
                $password = ""; // See package sent to you
                $this->d = new PDO( "", $username, $password ); // See package sent to you
                $this->d->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
            } catch ( PDOException $e ) {
                $this->isConnected = false;
                $this->d = null;

                print_r( $e->getMessage() );
                header( "Location: /" );
            }
        }

        function destroy() {
            if ( $this->isConnected ) {
                //$this->d->query( "KILL CONNECTION_ID()" ); // This is important
                $this->d = null;
            }
        }
    }

    /**
     * XXTEA.
     */
    class XXTEA {

        /**
         * Delta.
         */
        const DELTA = 0x9E3779B9;

        /**
         * Convert long to string.
         *
         * @param mixed[] $v Value.
         * @param boolean $w Empty.
         *
         * @return string Value.
         */
        private static function long2str( $v, $w = false ) {
            $len = count( $v );
            $n = $len << 2;
            if ( $w ) {
                $m = $v[$len - 1];
                $n -= 4;
                if ( ( $m < $n - 3 ) || ( $m > $n ) ) return false;
                $n = $m;
            }
            $s = array();
            for ( $i = 0; $i < $len; $i++ ) {
                $s[$i] = pack( "V", $v[$i] );
            }
            if ( $w ) {
                return substr( join( "", $s ), 0, $n );
            }
            else {
                return join( "", $s );
            }
        }

        /**
         * Convert to binary string.
         *
         * @param mixed[] $v Value.
         * @param boolean $includeLength Empty.
         *
         * @return string Value.
         */
        private static function toBinaryString( $v, $includeLength = true ) {
            $length = count( $v );
            $n = $length << 2;
            if ( $includeLength ) {
                $m = $v[$length - 1];
                $n -= 4;
                if ( ( $m < $n - 3 ) || ( $m > $n ) ) {
                    return null;
                }
                $n = $m;
            }
            $s = array();
            for ( $i = 0; $i < $length; $i++ ) {
                $s[$i] = pack( "V", $v[$i] );
            }
            $result = join( "", $s );
            if ( $includeLength ) {
                return substr( $result, 0, n );
            }
            return $result;
        }

        /**
         * Convert string to long.
         *
         * @param string $s String.
         * @param boolean $w Empty.
         *
         * @return int[] Value.
         */
        private static function str2long( string $s, $w = false ) {
            $v = unpack( "V*", $s. str_repeat( "\0", ( 4 - strlen( $s ) % 4 ) & 3 ) );
            $v = array_values( $v );
            if ( $w ) {
                $v[count( $v )] = strlen( $s );
            }
            return $v;
        }

        /**
         * int32.
         *
         * @param int $n Value.
         *
         * @return int Value.
         */
        private static function int32( int $n ) {
            return ( $n & 0xffffffff );
        }

        /**
         * mx.
         *
         * @param int $sum Value.
         * @param int $y Value.
         * @param int $z Value.
         * @param int $p Value.
         * @param int $e Value.
         * @param int[] $k Value.
         *
         * @return int Value.
         */
        private static function mx( $sum, $y, $z, $p, $e, $k ) {
            return ( ( ( $z >> 5 & 0x07ffffff ) ^ $y << 2 ) + ( ( $y >> 3 & 0x1fffffff ) ^ $z << 4 ) ) ^ ( ( $sum ^ $y ) + ( $k[$p & 3 ^ $e] ^ $z ) );
        }

        /**
         * fixk.
         *
         * @param int[] $k Value.
         *
         * @return int[] Value.
         */
        private static function fixk( $k ) {
            if ( count( $k ) < 4 ) {
                for ( $i = count( $k ); $i < 4; $i++ ) {
                    $k[$i] = 0;
                }
            }
            return $k;
        }

        /**
         * Encrypt a string.
         *
         * @param string $str The string to be encrypted.
         * @param string $key The key.
         *
         * @return string The encrypted string.
         */
        public static function encrypt( string $str, string $key ) {
            if ( $str === "" ) {
                return "";
            }
            $v = self::str2long( $str, true );
            $k = self::fixk( self::str2long( $key, false ) );
            $n = count( $v ) - 1;
            $z = $v[$n];
            $q = floor( 6 + 52 / ( $n + 1 ) );
            $sum = 0;
            while ( 0 < $q-- ) {
                $sum = self::int32( $sum + self::DELTA );
                $e = $sum >> 2 & 3;
                for ( $p = 0; $p < $n; $p++ ) {
                    $y = $v[$p + 1];
                    $z = $v[$p] = self::int32( $v[$p] + self::mx( $sum, $y, $z, $p, $e, $k ) );
                }
                $y = $v[0];
                $z = $v[$n] = self::int32( $v[$n] + self::mx( $sum, $y, $z, $p, $e, $k ) );
            }
            return base64_encode( self::toBinaryString( $v, false ) );
        }

        /**
         * Decrypt a string.
         *
         * @param string $str The string to be decrypted.
         * @param string $key The key.
         *
         * @return string The decrypted string.
         */
        public static function decrypt( string $str, string $key ) {
            if ( $str === "" ) {
                return "";
            }

            $v = self::str2long( base64_decode( $str ), false );
            $k = self::fixk(self::str2long( $key, false ) );
            $n = count( $v ) - 1;
            $y = $v[0];
            $q = floor( 6 + 52 / ( $n + 1 ) );
            $sum = self::int32( $q * self::DELTA );
            while ( $sum != 0 ) {
                $e = $sum >> 2 & 3;
                for ( $p = $n; $p > 0; $p-- ) {
                    $z = $v[$p - 1];
                    $y = $v[$p] = self::int32( $v[$p] - self::mx( $sum, $y, $z, $p, $e, $k ) );
                }
                $z = $v[$n];
                $y = $v[0] = self::int32( $v[0] - self::mx( $sum, $y, $z, $p, $e, $k ) );
                $sum = self::int32( $sum - self::DELTA );
            }
            return self::long2str( $v, true );
        }
    }

    /**
     * Class that handles neat stuff.
     */
    class neigh {

        /**
         * Return Probable Real IP.
         *
         * @param string $default default Return value if no IP found.
         * @param int $filter_options filter options. default is FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE.
         *
         * @return string Probably Real IP.
         */
        public function ip( $default = "Invalid IP", $filter_options = 12582912 ) {
            @$HTTP_X_FORWARDED_FOR = isset( $_SERVER ) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : getenv( "HTTP_X_FORWARDED_FOR" );
            @$HTTP_CLIENT_IP = isset( $_SERVER ) ? $_SERVER["HTTP_CLIENT_IP"] : getenv( "HTTP_CLIENT_IP" );
            @$HTTP_CF_CONNECTING_IP = isset( $_SERVER ) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : getenv( "HTTP_CF_CONNECTING_IP" );
            @$REMOTE_ADDR = isset( $_SERVER ) ? $_SERVER["REMOTE_ADDR"] : getenv( "REMOTE_ADDR" );

            $all_ips = explode( ",", "$HTTP_X_FORWARDED_FOR,$HTTP_CLIENT_IP,$HTTP_CF_CONNECTING_IP,$REMOTE_ADDR" );
            foreach ( $all_ips as $ip ) {
                if ( $ip = filter_var( $ip, FILTER_VALIDATE_IP, $filter_options ) )
                    break;
            }
            return $ip ? $ip : $default;
        }

        /**
         * Encrypt a string.
         *
         * @param string $str The string to be encrypted.
         * @param string $key The key.
         *
         * @return string The encrypted string.
         */
        public function encrypt( string $str, string $key ) {
            return XXTEA::encrypt( $str, $key );
        }

        /**
         * Decrypt a string.
         *
         * @param string $str The string to be decrypted.
         * @param string $key The key.
         *
         * @return string The decrypted string.
         */
        public function decrypt( string $str, string $key ) {
            return XXTEA::decrypt( $str, $key );
        }

        /**
         * Emails log on errors.
         *
         * @param string $log The log contents.
         * @param bool $err Was an error?
         *
         * @return bool True or false based on mail success.
         */
        public function log( string $log, $err = false ) {
            $headers = "From: duck@nyrion.ca \r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

            $log .= "<br/><br/>";
            $fheaders = getallheaders();
            foreach ( $fheaders as $key => $val ) {
                $log .= $key.": ".$val."<br/>";
            }

            foreach ( $_SERVER as $key => $val ) {
                $log .= $key.": ".$val."<br/>";
            }

            try {
                mail( "wearenyrion@pm.me", "Automated Neight Message", $log, $headers );
            } catch ( ErrorException $e ) {
                print_r( $e );
                return false;
            }

            if ( $err === true && self::ip() !== NULL ) {
                $addr = "Deny from ".self::ip()."\n";
                try {
                    file_put_contents( ".htaccess", $addr.PHP_EOL , FILE_APPEND | LOCK_EX );
                } catch ( ErrorException $e ) {
                    print_r( $e );
                }
            }

            return true;
        }
    }

    try {
        $neigh = new neigh();
        $ip = $neigh->ip();

        if ( isset( $_GET["d"] ) ) {
            $data = strval( $_GET["d"] );

            $data = $neigh->decrypt( $data, "" );

            if ( strpos( $data, "client=orca&data=assessments" ) !== false ) {
                $db = new Palm();

                $sql =<<<EOF
                    SELECT * FROM HORSE
                    LEFT JOIN AssetPhotos on HORSE.Id = AssetPhotos.AssetID AND AssetPhotos.AssetTableName = "HORSE"
EOF;

                $result = $db->d->query( $sql );

                $data = [];

                foreach( $result as $row ) {
                    $obj = new stdClass();
                    $obj->type = "horse";
                    $obj->id = $row["Id"];
                    $obj->age = $row["Age"];
                    $obj->breed = $row["Breed"];
                    $obj->height = $row["Height"];
                    $obj->name = $row["Name"];
                    $obj->weight = $row["Weight"];
                    $obj->photo = $row["PhotoURL"];

                    array_push( $data, $obj );
                }

                $sql =<<<EOF
                    SELECT * FROM OWNER
                    LEFT JOIN AssetPhotos on OWNER.Id = AssetPhotos.AssetID AND AssetPhotos.AssetTableName = "OWNER"
                    LEFT JOIN OwnerOnHorse on OWNER.Id = OwnerOnHorse.OwnerID;
EOF;

                $result = $db->d->query( $sql );

                foreach( $result as $row ) {
                    $obj = new stdClass();
                    $obj->type = "owner";
                    $obj->id = $row["Id"];
                    $obj->address = $row["Address"];
                    $obj->company = $row["Company"];
                    $obj->email = $row["Email"];
                    $obj->phone = $row["Phone"];
                    $obj->name = $row["Name"];
                    $obj->photo = $row["PhotoURL"];
                    $obj->ownerOnHorse = $row["HorseID"];

                    array_push( $data, $obj );
                }

                $sql =<<<EOF
                    SELECT * FROM JOCKEY
                    LEFT JOIN AssetPhotos on JOCKEY.Id = AssetPhotos.AssetID AND AssetPhotos.AssetTableName = "JOCKEY"
                    LEFT JOIN JockeyOnHorse on JOCKEY.Id = JockeyOnHorse.JockeyID;
EOF;

                $result = $db->d->query( $sql );

                foreach( $result as $row ) {
                    $obj = new stdClass();
                    $obj->type = "jockey";
                    $obj->id = $row["Id"];
                    $obj->age = $row["Age"];
                    $obj->build = $row["Build"];
                    $obj->height = $row["Height"];
                    $obj->name = $row["Name"];
                    $obj->weight = $row["Weight"];
                    $obj->photo = $row["PhotoURL"];
                    $obj->jockeyOnHorse = $row["HorseID"];

                    array_push( $data, $obj );
                }
                $db->destroy();

                $data = json_encode( $data );
                print_r( $neigh->encrypt( $data, "" ) );

                return;
            }
            $db->destroy();

            $log .= date( "Y-m-d @ g:i:s A" )." - Wrong, Unauthorized Attempt from: ".$ip."<br/>";
            $neigh->log( $log, true );
            header( "Location: /" );
        } else if ( isset( $_POST["d"] ) ) {
            $data = strval( $_POST["d"] );
            $data = $neigh->decrypt( $data, "" );

            $data = json_decode( $data );

            if ( strpos( $data->clientKey, "" ) !== false ) {
                $db = new Palm();

                $sql =<<<EOF
                    INSERT INTO HORSE (Name, Breed, Height, Weight, Age) VALUES (:horsename, :horsebreed, :horseheight, :horseweight, :horseage);
EOF;

                $stmt = $db->d->prepare( $sql );

                $stmt->bindParam( ":horsename", $data->horse->name );
                $stmt->bindParam( ":horsebreed", $data->horse->breed );
                $stmt->bindParam( ":horseheight", $data->horse->height );
                $stmt->bindParam( ":horseweight", $data->horse->weight );
                $stmt->bindParam( ":horseage", $data->horse->age );

                $stmt->execute();

                $horseId = intval( $db->d->lastInsertId() );

                $sql =<<<EOF
                    INSERT INTO JOCKEY (Name, Build, Height, Weight, Age) VALUES (:jockeyname, :jockeybuild, :jockeyheight, :jockeyweight, :jockeyage);
EOF;

                $stmt = $db->d->prepare( $sql );

                $stmt->bindParam( ":jockeyname", $data->jockey->name );
                $stmt->bindParam( ":jockeybuild", $data->jockey->build );
                $stmt->bindParam( ":jockeyheight", $data->jockey->height );
                $stmt->bindParam( ":jockeyweight", $data->jockey->weight );
                $stmt->bindParam( ":jockeyage", $data->jockey->age );

                $stmt->execute();

                $jockeyId = intval( $db->d->lastInsertId() );

                $sql =<<<EOF
                    INSERT INTO OWNER (Name, Company, Address, Phone, Email) VALUES (:ownername, :ownercompany, :owneraddress, :ownerphone, :owneremail);
EOF;

                $stmt = $db->d->prepare( $sql );

                $stmt->bindParam( ":ownername", $data->owner->name );
                $stmt->bindParam( ":ownercompany", $data->owner->company );
                $stmt->bindParam( ":owneraddress", $data->owner->address );
                $stmt->bindParam( ":ownerphone", $data->owner->phone );
                $stmt->bindParam( ":owneremail", $data->owner->email );

                $stmt->execute();

                $ownerId = intval( $db->d->lastInsertId() );

                $sql =<<<EOF
                    INSERT INTO AssetPhotos (AssetID, AssetTableName, PhotoURL) VALUES (:horseid, :horsetable, :horsephoto);

                    INSERT INTO AssetPhotos (AssetID, AssetTableName, PhotoURL) VALUES (:jockeyid, :jockeytable, :jockeyphoto);

                    INSERT INTO AssetPhotos (AssetID, AssetTableName, PhotoURL) VALUES (:ownerid, :ownertable, :ownerphoto);
EOF;

                $stmt = $db->d->prepare( $sql );

                $horseTable = "HORSE";
                $jockeyTable = "JOCKEY";
                $ownerTable = "OWNER";

                $horseSelfie = $data->horse->selfie;
                $jockeySelfie = $data->jockey->selfie;
                $ownerSelfie = $data->owner->selfie;

                if ( !isset( $horseSelfie ) || 0 >= strlen( $horseSelfie ) ) $horseSelfie = "/default.png";
                if ( !isset( $jockeySelfie ) || 0 >= strlen( $jockeySelfie ) ) $jockeySelfie = "/default.png";
                if ( !isset( $ownerSelfie ) || 0 >= strlen( $ownerSelfie ) ) $ownerSelfie = "/default.png";

                $stmt->bindParam( ":horseid", $horseId, PDO::PARAM_INT );
                $stmt->bindParam( ":horsetable", $horseTable );
                $stmt->bindParam( ":horsephoto", $horseSelfie );

                $stmt->bindParam( ":jockeyid", $jockeyId, PDO::PARAM_INT );
                $stmt->bindParam( ":jockeytable", $jockeyTable );
                $stmt->bindParam( ":jockeyphoto", $jockeySelfie );

                $stmt->bindParam( ":ownerid", $ownerId, PDO::PARAM_INT );
                $stmt->bindParam( ":ownertable", $ownerTable );
                $stmt->bindParam( ":ownerphoto", $ownerSelfie );

                $stmt->execute();

                $db->destroy();

                print_r( $neigh->encrypt( "houston_we_have_a_landing", "" ) );
            } else {
                $log .= date( "Y-m-d @ g:i:s A" )." - Wrong, Unauthorized Attempt from: ".$ip."<br/>";
                $neigh->log( $log, true );
                header( "Location: /" );
            }
        } else {
            $log .= date( "Y-m-d @ g:i:s A" )." - Wrong, Unauthorized Attempt from: ".$ip."<br/>";
            $neigh->log( $log, true );
            header( "Location: /" );
        }
    } catch ( \Throwable $e ) {
        $log .= date( "Y-m-d @ g:i:s A" )." - Wrong, Unauthorized Attempt from: ".$ip."<br/>".$e;
        $neigh->log( $log, true );
        header( "Location: /" );
    }

?>
