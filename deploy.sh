#!/bin/bash

clear

export TERM=xterm-256color

echo "Deploying North Orca Demonstration (Mobile)..."

cd "/System/Volumes/data/cloud/nyrion/www/north-orca"

cordova build ios --device --release
cordova build android --device --release -- --keystore="/System/Volumes/data/cloud/nyrion/www/north-orca/platforms/android/android.keystore" --storePassword=TODO --alias=android --password=TODO

cordova build electron --release

rsync -r -v --progress "/System/Volumes/data/cloud/nyrion/www/north-orca/release_notes" -e ssh ubuntu@nyrion.ca:~/release_notes_manager
rsync -r -v --progress "/System/Volumes/data/cloud/nyrion/www/north-orca/testers" -e ssh ubuntu@nyrion.ca:~/testers_manager

rsync -r -v --progress "/System/Volumes/data/cloud/nyrion/www/north-orca/platforms/ios/build/release/North Orca.ipa" -e ssh ubuntu@nyrion.ca:~/ios-north-orca.ipa
rsync -r -v --progress "/System/Volumes/data/cloud/nyrion/www/north-orca/platforms/android/app/build/outputs/apk/release/app-release.apk" -e ssh ubuntu@nyrion.ca:~/android-north-orca.apk

ssh ubuntu@nyrion.ca /bin/bash <<\EOF

    curl -sL firebase.tools | bash

    cd ~

    firebase appdistribution:distribute "ios-north-orca.ipa" --app YOUR_FIREBASE_APP_ID --release-notes-file "release_notes" --testers-file "testers_north_orca"
    firebase appdistribution:distribute "android-north-orca.apk" --app YOUR_FIREBASE_APP_ID --release-notes "release_notes" --testers-file "testers_north_orca"

EOF

rm -f ~/.zsh_history
rm -f ~/.bash_history