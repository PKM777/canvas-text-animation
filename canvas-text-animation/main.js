import './style.css'

window.addEventListener('load', function(){
  const canvas1 = document.getElementById('textCanvas')
  const ctx = canvas1.getContext('2d')
  canvas1.width = window.innerWidth
  canvas1.height = window.innerHeight

// console.log(canvas1.width, canvas1.height)


  class Particles{
    constructor(effect,x,y,color){
      this.effect = effect
      this.x = Math.random() * this.effect.width
      this.y = Math.random() * this.effect.height
      this.originX = x
      this.originY = y
      this.color = color
      this.size = this.effect.gap
      this.dx = 0
      this.dy = 0 
      this.vx = 0
      this.vy = 0
      this.angle = 0
      this.force = 0
      this.distance = 0
      this.friction = Math.random() * 0.6 + 0.15
      this.ease = Math.random() * 0.01 + 0.0005

    }
    draw(){
      this.effect.context.fillStyle = this.color
      this.effect.context.fillRect(this.x, this.y, this.size, this.size)
      this.effect.context.strokeRect(this.x, this.y, this.size, this.size)
      this.effect.context.strokeStyle = 'yellow'
      // this.effect.context.beginPath()
      // this.effect.context.moveTo(this.effect.mouse.x, this.effect.mouse.y)
      // this.effect.context.lineTo(this.x+this.effect.gap/2, this.y+this.effect.gap/2)
      // this.effect.context.strokeStyle = 'yellow'
      // this.effect.context.stroke()
      
    }
    update(){
      this.dx = this.effect.mouse.x - this.x
      this.dy = this.effect.mouse.y - this.y 
      this.distance = this.dx*this.dx + this.dy*this.dy
      this.force = - this.effect.mouse.radius/ this.distance

      if(this.distance < this.effect.mouse.radius){
        this.angle = Math.atan2(this.dy, this.dx)
        this.vx += this.force* Math.cos(this.angle)
        this.vy += this.force* Math.sin(this.angle)
      }

      this.x += (this.vx*=this.friction) + (this.originX - this.x) * this.ease
      this.y += (this.vy*=this.friction) + (this.originY - this.y) * this.ease
   
    }
  }
  

  class Effect{
    constructor(context, canwidth, canheight){
      this.context = context
      this.width = canwidth
      this.height = canheight
      this.textX = this.width/2
      this.textY = this.height/2
      this.line = ''
      this.words = undefined
      this.lineArray = []
      this.lineCounter = 0
      this.maxWidth = this.width*0.8
      this.lineHeight = 80

      // partcle section
      this.particles = []
      this.gap = 5
      this.mouse = {
        radius : 20000,
        x:0,
        y:0
      }
      window.addEventListener('mousemove', (e)=>{
        this.mouse.x = e.x
        this.mouse.y = e.y
      })
      
    }

    textWrapper(text){

      const gradient = this.context.createLinearGradient(0,0,this.width, this.height) 
      gradient.addColorStop(0.3, 'red')
      gradient.addColorStop(0.5, 'fuchsia')
      gradient.addColorStop(0.7, 'purple')
      this.context.font='250px helevetica'
      this.context.textAlign = 'center'
      this.context.strokeStyle = 'white'
      this.context.fillStyle = gradient
      this.context.textBaseline = 'middle'
    
      this.words = text.split(' ')
     for(let i =0; i<this.words.length; i++){
        let textline =this.line + this.words[i] + ' '
        if(this.context.measureText(textline).width > this.maxWidth){
          this.line =this.words[i] + ' '
          this.lineCounter++
        }else{
          this.line = textline
        }
        this.lineArray[this.lineCounter] = this.line
        
      }
  
     
      this.lineArray.forEach((el, index)=>{
        this.context.fillText(el, this.textX, this.textY + index * this.lineHeight)
      })

      this.toParticles()
    }

    toParticles(){
      
      const pixels = this.context.getImageData(0,0,this.width, this.height).data
      this.context.clearRect(0,0,this.width, this.height)
      for(let i = 0; i < this.height ; i += this.gap){
        for(let j = 0; j < this.width; j += this.gap){
          const index = (i * this.width + j) * 4
          const alpha = pixels[index+3]
           if(alpha > 0){
            const red = pixels[index]
            const green = pixels[index + 1]
            const blue = pixels[index + 2]
            const color = 'rgb(' + red + ',' + green + ',' + blue + ')'
            
            
            this.particles.push(new Particles(this, j, i , color))
          }
        }
      }
    
    }


    render(){
        this.particles.forEach((part)=>{
        part.update()
        part.draw()
      })
    }
}

const effect = new Effect(ctx, canvas1.width, canvas1.height)
effect.textWrapper('PKM')
// 'ಎಲ್ಲಾ ಮಾನವರೂ ಸ್ವತಂತ್ರರಾಗಿಯೇ'
effect.render()

function anime(){
  ctx.clearRect(0,0,canvas1.width,canvas1.height)
  effect.render()
  requestAnimationFrame(anime)
 
  
}
anime()

})



// const text = 'hello what'
  // const textX = canvas1.width/2
  // const textY = canvas1.height/2

  
  // ctx.font='80px helevetica'
  // ctx.textAlign = 'center'
  // ctx.strokeStyle = 'white'
  // ctx.fillStyle = gradient
  // ctx.textBaseline = 'middle'
  // ctx.fillText(text, textX, textY)
  // ctx.strokeText(text, textX, textY)
  // const maxWidth = canvas1.width*0.8
  // function textWrapper(text){
  //   let line = ''
  //   const words = text.split(' ')
  //   let lineArray = []
  //   let lineCounter = 0
  //   for(let i =0; i<words.length; i++){
  //     let textline = line + words[i] + ' '
  //     if(ctx.measureText(textline).width > maxWidth){
  //       line = words[i] + ' '
  //       lineCounter++
  //     }else{
  //       line = textline
  //     }
  //     lineArray[lineCounter] = line
      
  //   }

   
  //   lineArray.forEach((el, index)=>{
  //     ctx.fillText(el, textX, textY + index * 70)
  //   })
  // }
 
  // textWrapper('hello world how are you what the hell')