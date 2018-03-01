import React, { Component } from 'react';
import styles from './Canvas.module.css'

class Canvas extends Component  {

  constructor (props) {
    super(props);
    this.particles = [];
    // this.ctx = null;
    // this.canvas = null;
    // this.imageData = null;
    this.progress = this.frameIdx = 0;
  }

  render() {
    return (
      <canvas
        className={styles.canvas}
        width={document.documentElement.clientWidth}
        height={document.documentElement.clientHeight}
        ref={el => this.ref = el}
      ></canvas>
    )
  }

  componentDidMount() {
    this.canvas = this.ref;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.globalAlpha = 1;
    this.ctx.font = '4rem Lato';
    this.ctx.fillStyle = 'white';

    // The top coord is given with reference to the top of the original div but
    // fillText uses the bottom of the type as reference, so we need to offset
    // the top position by the size of the font (minus 1 px?)
    this.ctx.fillText(this.props.text, this.props.textCoord.left, this.props.textCoord.top + 4 * 16);

    this.imageData = this.ctx.getImageData(0 ,0, this.canvas.width, this.canvas.height);
    let pixels = this.imageData.data;
    for(let x=0; x < this.imageData.width ; x++) {
      for(let y=0; y < this.imageData.height ; y++) {
        let i = (y * this.imageData.width + x) * 4;
        if(pixels[i] !== 0 && pixels[i+1] !== 0 && pixels[i+2] !== 0 && pixels[i+3] !== 0) {
          this.particles.push(this.particle(x, y));
        }
      }
    }

    this.startTime = Date.now();
    requestAnimationFrame(this.draw.bind(this));
  }

  particle(x, y) {
    return {
      x: x,
      y: y
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update progress; used for slowing things down and adding entropy
    this.frameIdx ++;
    if(this.frameIdx % 10 === 0) {
      this.progress++;
      this.frameIdx = 0;
    }

    // Render particles at new position
    this.ctx.globalAlpha = this.ctx.globalAlpha - this.progress / 50 ;
    for(let i = 0; i < this.particles.length; i++) {
      this.particles[i] = {x: this.particles[i].x + this.getRandomIntInclusive(- this.progress, this.progress), y: this.particles[i].y - this.getRandomIntInclusive(0 + this.progress , 4 + this.progress)}
      this.ctx.fillRect(this.particles[i].x, this.particles[i].y, 1, 1);
    }

    if(Date.now() - this.startTime > 1000) {
      this.props.onFinishAnimation()
    } else {
      requestAnimationFrame(this.draw.bind(this));
    }
  }

  // The maximum is inclusive and the minimum is inclusive
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default Canvas;
