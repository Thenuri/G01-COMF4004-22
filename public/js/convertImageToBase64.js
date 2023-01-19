async function convertImgToBase64(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            resolve(base64String);
        }
        reader.readAsDataURL(imageFile);
    });
}

