const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random')


const settings = {
  dimensions: [ 1080 , 1080 ],
  // 下動畫屬性
  animate:true
};

const animate = () =>{
  console.log('123')
  requestAnimationFrame(animate)
}
// animate()

// 把參數 複製到最上面
const sketch = ({ context, width, height }) => {
  // 做空陣列
  const agents = []
  // 做 40 個點
  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width) 
    const y = random.range(0, height)
    // 放進去陣列
    agents.push(new Agent(x,y))
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      
      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos)
        // 長度大於 200 不連線
        if (dist > 200) continue

        context.lineWidth = math.mapRange(dist, 0 , 200, 12 , 1)
        
        context.beginPath()
        context.moveTo(agent.pos.x,agent.pos.y)
        context.lineTo(other.pos.x,other.pos.y)
        context.stroke()
      }
    }



    // 產生剛剛跑 for 40 個點 並畫出來
    agents.forEach(agent => {
      agent.update()
      agent.draw(context)
      agent.bounce(width, height)
    })
  };
};

canvasSketch(sketch, settings);
// 產物件
class Vector{
  constructor(x, y){
    this.x = x
    this.y = y
  }

  // 做一個靠近才會連線的函示
  getDistance(v){
    const dx = this.x - v.x
    const dy = this.y - v.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}
// 產出一個物件
class Agent{
  // 宣告建構子
  constructor(x, y){
    // 呼叫建構 x y 軸的部分
    this.pos = new Vector(x, y)
    this.vel = new Vector(random.range(-1,1), random.range(-1,1))
    this.radius = random.range(4, 12)
  }

  bounce(width, height){
    // 限制有牆壁會回彈圓球
    if(this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1
    if(this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1
  }

  update(){
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  // 製作共同畫點的函式
  draw(context){
    // context.fillStyle = 'black'

    context.save()
    context.translate(this.pos.x, this.pos.y)

    context.lineWidth = 4

    context.beginPath()
    context.arc(0, 0, this.radius, 0, Math.PI * 2)
    context.fill()
    context.stroke()

    context.restore()
  }
}