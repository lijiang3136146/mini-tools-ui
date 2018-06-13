# cut

图片裁剪。

## cut
```
| 属性 | 说明 | 类型 | 默认值 | 必选 |
|----|----|----|----|
| width | 裁剪范围宽度 | Number | 300 | false |
| height | 裁剪范围高度 | Number | 300 | false |
| onChange | 返回裁剪后图片的路径 | function | (ev: arry): void | false |
| pixelRatio | 图片画质（1-3） | Number | 2 | false |
| saveFile | 默认返回临时图片地址,true时返回保存后的图片地址 | boolean | false | false |
```

## using
 
```
// page.json
{
  "defaultTitle": "小程序AntUI组件库",
  "usingComponents":{
    "cut":"mini-antui/es/cut/index",
  }
}
```
## examples

```axml
<cut
width="{{300}}"
height="{{300}}"
pixelRatio="{{2}}"
saveFile="{{true}}"
onChange="onChange"
/>
```

