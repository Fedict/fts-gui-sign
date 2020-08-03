# Style configurations 

## images
The application has a few images that can be changes. The images can be changed before build (in the /public folder) or after the build (in the /build folder)

### logo image
this image is placed in the left upper corner in the navbar. 
- /public/img/logo.png
- /build/img/logo.png

### side image
this image is placed on the left part of the screen.
- /public/img/img.jpg
- /build/img/img.jpg


## SignIcons
the application hase a selection screen to choose the signing methode. It uses svg icons to show icons for these choises. at this moment they are bootstrap icons. The icons can be changed before build (in the /public folder) or after the build (in the /build folder). 
the choises are hardcoded in /src/modules/startPage/StartPageContainer.js

### emailIcon
- /public/img/SignIcons/emailIcon.svg
- /build/img/SignIcons/emailIcon.svg

### personIcon
- /public/img/SignIcons/personIcon.svg
- /build/img/SignIcons/personIcon.svg
  

## css and colors
the application uses custom scss file. this file imports bootstrap. css from bootstrap can be overriden in this file. you have to rebuild the appication to make the changes take effect.
- style\custom.scss

to change the main color of the application change : 
```scss
$theme-colors: (
  "primary": #11a0ba,
);
```