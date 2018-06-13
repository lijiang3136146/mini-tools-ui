Component({
  data: {
    src: '',
    clipPath: '',
    outerHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    winWidth: 0,
    winHeight: 0,
    winTop: 30,
    imgLeft: '50%',
    imgTop: '50%',
    imgMarLeft: 0,
    imgMarTop: 0,
    imgWidth: 0,
    imgHeight: 0,
    ratio: 0,
    state: {
      touchs: true,
      touchLast: { x: 0, y: 0 },
      touchMove: { x: 0, y: 0 },
    },
    lastZoom: false,
    touchLast: false,
  },
  props: {
    className: '',
    width: 300, //裁剪宽高
    height: 300, //裁剪宽高'
    pixelRatio: 2, //图片画质
    align: 'about', //选择图片在画布中的对齐方式 自适应对齐auto,垂直对齐vertical,左右对齐about
    saveFile: false, //false为不保存返回，返回的文件是临时的，可能会丢失。true返回的是保存到本地的文件不会丢失。
    onChange: () => {}
  },
  didMount() {
    let { canvasWidth, canvasHeight, winWidth, winHeight, winTop, outerHeight } = this.data;
    let { width, height, pixelRatio, align } = this.props;
    canvasWidth = width;
    canvasHeight = height;
    winWidth = width;
    winHeight = height;
    align = align;
    my.getSystemInfo({
      success: (res) => {
        canvasWidth = pixelRatio * canvasWidth;
        canvasHeight = pixelRatio * canvasHeight;
        winTop = (res.windowWidth - winHeight) / 2;
        outerHeight = res.windowWidth;
        this.setData({
          winTop,
          pixelRatio,
          canvasWidth,
          canvasHeight,
          outerHeight,
          winWidth,
          winHeight,
          align
        });
      }
    })
  },
  methods: {
    imageLoad(e) {
      let { align, ratio, winWidth, winHeight, imgLeft, imgTop, imgMarLeft, imgMarTop, imgWidth, imgHeight } = this.data;
      let rect = e.detail;
      imgLeft = winWidth / 2;
      imgTop = winHeight / 2;
      ratio = rect.height / rect.width;
      if (align === 'auto') {
        if (rect.width >= rect.height) {
          imgWidth = winWidth;
          imgHeight = rect.height * imgWidth / rect.width;
        } else {
          imgHeight = winHeight;
          imgWidth = rect.width * imgHeight / rect.height;
        }
      }
      if (align === 'vertical') {
        imgHeight = winHeight;
        imgWidth = rect.width * imgHeight / rect.height;
      }
      if (align === 'about') {
        imgWidth = winWidth;
        imgHeight = rect.height * imgWidth / rect.width;
      }
      imgMarLeft = imgWidth / (-2);
      imgMarTop = imgHeight / (-2);
      this.setData({
        imgLeft,
        imgTop,
        imgWidth,
        imgHeight,
        imgMarLeft,
        imgMarTop,
        ratio
      });
      this.draw();
    },
    touchStart() {
      let { state, lastZoom, touchLast } = this.data;
      state.touchs = true;
      lastZoom = false;
      touchLast = false;
      this.setData({
        state,
        lastZoom,
        touchLast
      });
      this.context = my.createCanvasContext('canvas');
      this.context.drawImage('');
      this.context.draw();
    },
    touchMove(e) {
      let zoom = false;
      let { ratio, touchLast, lastZoom, winWidth, winHeight, imgLeft, imgTop, state, imgWidth, imgHeight } = this.data;
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY;
      if (e.touches.length < 2) {
        state.touchMove = { x: x - state.touchLast.x, y: y - state.touchLast.y };
        state.touchLast = { x: x, y: y };

        imgLeft = imgLeft + state.touchMove.x;
        imgTop = imgTop + state.touchMove.y;
        if (!touchLast) {
          touchLast = true;
          this.setData({
            state,
            touchLast
          });
        } else {
          this.setData({
            imgLeft,
            imgTop,
            state
          });
        }
      } else {
        let p1 = e.touches[0];
        let p2 = e.touches[1];
        let zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2));
        if (lastZoom) {
          let zoom = zoomScale - lastZoom;
          if (zoom >= 0) {
            imgWidth = imgWidth + 20;
            imgHeight = imgHeight + 20 * ratio;
            imgLeft = imgLeft - 10;
            imgTop = imgTop - 10 * ratio;
          } else if (imgWidth > 100) {
            imgWidth = imgWidth - 20;
            imgHeight = imgHeight - 20 * ratio;
            imgLeft = imgLeft + 10;
            imgTop = imgTop + 10 * ratio;
          }
        }
        lastZoom = zoomScale;
        this.setData({
          imgLeft,
          imgTop,
          imgWidth,
          imgHeight,
          lastZoom,
        });
      }
    },
    touchEnd() {
      this.draw();
    },
    draw() {
      let { clipPath, src, imgWidth, imgHeight, imgLeft, imgTop, imgMarLeft, imgMarTop, pixelRatio } = this.data;
      clipPath = src;
      this.context = my.createCanvasContext('canvas');
      this.context.drawImage(clipPath, (imgLeft + imgMarLeft) * pixelRatio, (imgTop + imgMarTop) * pixelRatio, imgWidth * pixelRatio, imgHeight * pixelRatio);
      this.context.draw();
    },
    toTempFilePath() {
      var _this = this;
      let { clipPath, src, winWidth, imgWidth, imgHeight, imgLeft, imgTop } = this.data;
      let { onChange, saveFile } = this.props;
      clipPath = src;
      if (clipPath !== '') {
        this.context.toTempFilePath({
          success(res) {
            if (saveFile) {
              my.call('saveFile', {
                apFilePath: res.apFilePath
              }, (res) => {
                onChange(res);
              });
            } else {
              onChange(res);
            }
          }
        })
        this.setData({
          clipPath
        });
      }
    },
    handleLoadImage() {
      let { src } = this.data;
      my.chooseImage({
        count: 1,
        success: (res) => {
          src = res.apFilePaths[0];
          this.setData({
            src
          });

        },
      });
    },
  }
});