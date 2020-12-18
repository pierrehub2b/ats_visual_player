# ATS Video Player
The ATS video player is a project that deserialize files from ATS to AMF.
When it's deserialize, when recompiles data for creating an HTML video player that show animations and actions.

# Procedure to install
* install NodeJS on your desktop
* with the cmd window, navigate to your local repository (ex: "cd <...>/github/ats_visual_player")
* run "npm install" command to install node modules

# Start a development server
"npm run develop" lunch a local development server that can be accessible by a local url.
Usually "http//localhost:8081"
**Note:** that command delete the "local" dist file so **don't commit without launch a "npm run build"**

# Build for production
"npm run build" generate a local "dist" file that bundle all js and scss files
Thats files are those that will be deployed to clients and be launched in "offline" mode
**Note:** that command **MUST BE** launched before a commit/push to the repository !