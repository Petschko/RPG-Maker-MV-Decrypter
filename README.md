# Petschko's RPG-Maker-MV File-Decrypter

## What's that?

This Project is used to decrypt RPG-Maker-MV-Resource-Files that are encrypted with the Build-In-Encryption of the RPG-Maker.

### Motivation behind this
As Art-Creator for the RPG-Maker by myself, it is sometimes hard to figure out, if somebody is using Resources from you (and may violate the licence like giving no credit or using a Non-Commercial-Resource in a Commercial Game for example).

I don't have time to play through all the games so i just quick look at the files but its only possible if the files are not encrypted...

Sad for me, more People use the build in Encryption from the RPG-Maker-MV so that's why I wrote this script - to get a quick look at the files without playing the whole game =) May some other artists will find this useful too.

### Legal-Notification
You are **not allowed** to use the Decrypted Files (**if its not allowed by the origin File-Licence**).
Please don't steal and reuse stuff that's not the idea of this Script!
You can save them for Private-Use only. If the origin Licence allow use you can use them of course but please follow the licences!

**If that's your Project** and you simply lost your Origin-Files, **you have the same rights**, to do stuff with them, **as before** =)

## Requirements
- Web-Browser with HTML5 Support

## Installation

This is very easy:

- Download/Clone the Project
- Extract/Put it where ever you want
- Done :)

## How to use?

- You have to open the "index.html" file with you Browser
  - Use rigth click and open with...
  - Use double click to open the file. Many Browsers set them as default applications for html files
- Open the directory of the Game with the encrypted Audio/Images
  - Check if the Files have one of the File-Extensions:
    - ".rpgmvp" (PNG-Files)
    - ".rpgmvm" (m4a-Files)
    - ".rpgmvo" (ogg-Files)
  - If the Files doesn't have this Extensions the Creator used an other Encryption/Pack-Tool. If that's the case you can't use this script for this Project.
- Get the Encryption-Key
  - Select with the first File-Picker the "System.json"-File which contains the "raw"-Encryption-Key
    - The File is located in `%PROJECT_DIRECTORY%/www/data/System(.json)`
  - Click on the Detect-Button - If it found the Key it will automaticly insert it for you in the next Input-Field
- Select the Encrypted Audio/Image-Files to decrypt
- Click on the Decrypt-Button
- The Decrypted-File(s) are shown as blob:link(s), below the Decrypt-Button. You can open them and/or save them (or just view/listen)

## Contact

- E-Mail me if you have questions (no bug reporting please): peter-91@hotmail.de
- Please report Bugs here on github.com use the "Issue"-Section on this Project
