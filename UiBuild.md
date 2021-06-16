UI build and deploying steps
==============================

1.  Take latest changes from either master/develop branch
2.  Validate the souce codde by doing npm start or ng serve 
3.  Start UI build by running command  ng build --prod'
4.  Dist folder will create inside "uslandgrid/dist/"
5.  Open winSCP tool for deployment with Hostname username and password.
    Please save this workspace so you don't need to enter hostname username and password for every deployment
6.  After successful login in winSCP you will see two parallel windows.
    first window is source window from where we have local dist folder
    second window "var/usalnd-fe/" is Destinnation window where you need to upload files from souce window.
    Before uploading files to destination window please delete existing files then only start copy souce dist folder files
7.  Once all files copied into destination folder, visit cloud.uslandgrid.com  