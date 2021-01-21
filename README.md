# ATS Video Player
The ATS video player is a project that deserialize files from ATS to AMF.
When it's deserialize, when recompiles data for creating an HTML video player that show animations and actions.

## Users
### How to install
Download the "Release.zip" file available ine the current repository. After, you have two options:
* you can deploy the application directly on your own WebApp or server
* for local use, you can run the "player.bar" file. Your default browser will launch automatically

### How to use
Simply open a ATSV file using the browse file component in the application page 

### Features
* You can put some of your own ATSV in a directory (located in the src directory) and reference the relative path to that in the "library.json" file. The referenced files will be available when you open the player.
    * exemple: if you create a directory named "My ATSV" and put a "test.atsv" inside, you juste have to insert "My ATSV/test.atsv" in the "library.json" (according to the JSON nomenclature)
* You can reference a ATSV file directly in the player URL. The called file will be opened and read when you access to the page
    * exemple: if you put "http://localhost?url=/My%20ATSV/test.atsv", the file "test.atsv" located in the "My ATSV" folder will be launched at start. **Note that only relative path to the server or full Web public URL will work**
* You can customize the player interface by adding the logo, or another link to your company's JSON library. To do this, all you have to do is define new values ​​in the "settings.txt" file contained in the SRC folder

## Developer
### Procedure to install
* install NodeJS on your desktop
* with the cmd window, navigate to your local repository (ex: "cd <...>/github/ats_visual_player")
* run "npm install" command to install node modules

### Start a development server
"npm run develop" lunch a local development server that can be accessible by a local url.
Usually "http//localhost:8081"
**Note:** that command delete the "local" dist file so **don't commit without launch a "npm run build"**

### Build for production
"npm run build" generate a local "dist" file that bundle all js and scss files
Thats files are those that will be deployed to clients and be launched in "offline" mode
**Note:** that command **MUST BE** launched before a commit/push to the repository !