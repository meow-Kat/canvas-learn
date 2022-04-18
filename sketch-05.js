const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager

let text = 'A'
let fontSize = 1200
let fontFamily = 'Helvetica'

const typeCanvas = document.createElement('canvas')
const typeContext = typeCanvas.getContext('2d')

const sketch = ({ context, width, height }) => {
  const cell = 20
  const cols = Math.floor(width / cell)
  const rows = Math.floor(height / cell)
  const numCells = cols * rows

  typeCanvas.width = cols
  typeCanvas.height = rows

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.1

    typeContext.fillStyle = 'white'
    // context.font = fontSize + 'px ' + fontFamily
    typeContext.font = `bold ${fontSize}px ${fontFamily}`
    typeContext.textBaseline = 'top'
    // context.textAlign = 'center'

    // const text = 'A';

    const metrics = typeContext.measureText(text)
    const mx = metrics.actualBoundingBoxLeft * -1
    const my = metrics.actualBoundingBoxAscent * -1
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight 
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    const tx = (cols - mw) * 0.5 - mx
    const ty = (rows - mh) * 0.5 - my 

    typeContext.save()
    typeContext.translate(tx, ty)

    typeContext.beginPath()
    typeContext.rect(mx,my,mw,mh)
    typeContext.stroke()

    typeContext.fillText(text,0,0)
    typeContext.restore()

    const typeData = typeContext.getImageData(0,0,cols,rows).data
    // console.log(typeData);

    
    context.fillStyle = 'black'
    context.fillRect(0,0,width,height)

    context.textBaseline = 'middle'
    context.textAlign = 'center'

    // context.drawImage(typeCanvas,0,0)
    
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor( i / cols)

      const x = col * cell
      const y = row * cell

      const r = typeData[i * 4 + 0]
      const g = typeData[i * 4 + 1]
      const b = typeData[i * 4 + 2]
      const a = typeData[i * 4 + 3]

      const glyph = getGlyph(r)

      context.font = `${cell * 2}px ${fontFamily}`
      if(Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`

      // context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
      context.fillStyle = 'white'

      context.save()
      context.translate(x,y)
      context.translate(cell * 0.5,cell * 0.5)

      // context.fillRect(0,0,cell,cell)

      context.fillText(glyph,0,0)

      // context.beginPath()
      // context.arc(0,0,cell * 0.5,0,Math.PI *2)
      // context.fill()

      context.restore()
    }
  };
};

const getGlyph = (v) => {
  // v 是 rgba 的 r
  if(v < 50 ) return ''
  if(v < 100 ) return '*';
  if(v < 150 ) return '.';
  if(v < 200 ) return '';

  // 把這個 _=/ 分割字串，如果碰到 () 內的東西可以切開並存成陣列
  const glyphs = 'meow'.split('')

  // return text
  return random.pick(glyphs)
}

const onKeyUp = (e) => {
  text = e.key.toUpperCase()
  manager.render()
}

document.addEventListener('keyup', onKeyUp)

const start = async () => {
  manager = await canvasSketch(sketch, settings);
}
start()

/*
const url = 'https://picsum.photos/200'

const loadSomeImage = (url) => {
  // Promise load 畫面的時候要載入
  return new Promise((resolve, reject) => {
    const img = new Image()
    // 完全載入後才會回傳圖片 (固定寫法)
    img.onload = () => resolve(img)
    // 如果有錯誤的時候，會拒絕
    img.onerror = () => reject()
    img.src = url;
  })
}

              // 同步
const start = async() => {
  // 等待 Promise 執行後才執行後面程式
  const img = await loadSomeImage(url).then(img => {
    console.log(img.width);
  })
  console.log('Im wait');
}

// const start = () => {
//   loadSomeImage(url).then(img => {
//     console.log(img.width);
//   })
//   console.log('Im frist');
// }

start()

*/