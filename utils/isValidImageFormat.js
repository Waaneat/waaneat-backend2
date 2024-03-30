const isValidImageFormat = (image)=>{
    const allowedFormats = ['.jpg', '.jpeg', '.png']; 
    const fileExtension = image.substring(image.lastIndexOf('.')).toLowerCase();
    return allowedFormats.includes(fileExtension);
}

module.exports = isValidImageFormat;