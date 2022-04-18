const canvasSketch = require('canvas-sketch');
// 安裝 canvas-sketch 官方函式
// npm install canvas-sketch-util --save
// 呼叫函裝好的函式
const math = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')


const settings = {
  dimensions: [ 1080, 1080 ]
};

// // 角度轉弧度
// const degToRad = (degrees) =>{
//   return degrees / 180 * Math.PI
// }

// // scale 最大最小值
// const randomRange = (min, max) => {
//   return Math.random() * (max - min) + min
// }

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black'

    const cx = width * 0.5
    const cy = height * 0.5
    let x, y

    const w = width * 0.01
    const h = height * 0.1

    const num = 20
    const radius = width * 0.3

    for (let i = 0; i < num; i++) {
      // 使用上面的函示
      const slice = math.degToRad(360 / num)
      // 每個角度會根據 i 變化
      const angle = slice * i

      x = cx + radius * Math.sin(angle)
      y = cy + radius * Math.cos(angle)

      // 搭配 restore
      context.save()
      // 這邊會重新計算中心點而不是左上角
      context.translate(x,y)
      context.rotate(-angle)
      // scale(x, y) 跟 css 差不多 // 使用函式庫
      context.scale(random.range(0.1,2), random.range(0.2,0.5))

      context.beginPath()
      // 這邊跟 transform:translate(-50%, -50%) 很像
      context.rect( -w * 0.5, random.range( -h * 0.5 ), w, h)
      context.fill()
      // 回復畫布狀態
      context.restore()

      context.save()
      context.translate(cx,cy)
      context.rotate(-angle)

      context.lineWidth = random.range(5,20)
  
      context.beginPath()
      // arc(x,y , 半徑, 起始角度, 結束角度) 畫弧線
      context.arc(0,0, radius * random.range(0.7,1.3), slice * random.range(1, -8), slice * random.range(1, 5))
      context.stroke()
  
      context.restore()

    }


    // 設座標
    // context.translate(100,400)
    // 畫圓
    // context.beginPath()
    // context.arc(0,0,50,0,Math.PI * 2)
    // context.fill()



  };
};

canvasSketch(sketch, settings);
