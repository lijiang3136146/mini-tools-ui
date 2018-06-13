Page({
  onChange(e) {
    console.log(e);
    my.previewImage({
      urls: [e.apFilePath],
    });
  }
});