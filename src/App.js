import { Component } from 'react';
import './App.css';
import Snake from './Snake';
import Food from './Food';


const getRandomCoordinates = (snakeDots) => {
  let min = 1;
  let max = 95; //95
  let x = Math.floor((Math.random()*(max-min+1)+min)/5)*5;
  let y = Math.floor((Math.random()*(max-min+1)+min)/5)*5;


  if (!snakeDots.some(a=>a.x===x && a.y===y)){
    return [x, y];
  }else{
    return getRandomCoordinates(snakeDots);
  }
}

const snakeWidth = 5;

const initialState = {
  food:getRandomCoordinates([{x:0,y:0},{x:5,y:0}]),
  speed: 350,
  direction: 'RIGHT',
  snakeDots:[
    {x:0,y:0},
    {x:5,y:0},
  ]
}

let tId;
class App extends Component{

  state = initialState;


  componentDidMount(){
    document.onkeydown = this.onKeyDown;
    if(!tId){
      tId = setInterval(this.moveSnake, this.state.speed);
    }
  }

  componentDidUpdate(){
    this.checkOutBorders();
    this.checkIfCollapsed();
    this.checkIfEats();
    
  }

  onKeyDown =(e)=>{
    
    e = e || window.event;

    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }

  moveSnake = (e) =>{
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length -1];

    switch (this.state.direction){
      case 'RIGHT':
        head = {x: head.x + snakeWidth, y: head.y};
        break;
      case 'LEFT':
        head = {x: head.x - snakeWidth, y:head.y};
        break;
      case 'UP':
        head = {x: head.x, y:head.y - snakeWidth};
        break;
      case 'DOWN':
        head = {x: head.x, y:head.y + snakeWidth};
        break;
    }


    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    });
  }

  checkOutBorders(){
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if(head.x >= 100 || head.y >= 100 || head.x < 0 || head.y <0){
      this.onGameOver();
    }
  }

  checkIfCollapsed(){
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length-1];
    snake.pop();
    snake.forEach(dot => {
      if(head.x === dot.x && head.y === dot.y){
        this.onGameOver();
      }
    })
  }

  checkIfEats(){
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;

    if(head.x === food[0] && head.y === food[1]){

      this.setState({
        food: getRandomCoordinates(this.state.snakeDots)
      });
      this.snakeGrowth();
      this.increaseSpeed();
    }
  }

  snakeGrowth(){
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  increaseSpeed(){
    if(this.state.speed >50){
      this.setState({
        speed:this.state.speed - 10
      })
    }
    this.resetSpeed(this.state.speed);
  }

  onGameOver(){
    console.log(localStorage.getItem("BestScore"));
    let oldBestScore = localStorage.getItem("BestScore");
    if(this.state.snakeDots.length > oldBestScore){
      localStorage.setItem("BestScore", this.state.snakeDots.length)
      alert (`Congrats🎉, You passed your best score! Snake length is ${this.state.snakeDots.length}!`);
    }else{
      alert (`Game Over. Snake length is ${this.state.snakeDots.length}`);
    }
    this.setState(initialState);
    this.resetSpeed(350);

    

  }

  resetSpeed(speed){
    clearInterval(tId);
    tId = null;
    if(tId === null){
      console.log(speed);
      tId = setInterval(this.moveSnake, speed);
    }
  }

  render(){
    return(
      <div className="container">
      <div className="header">
        <div className="col-6"><h1>Snake Game</h1></div>
        <div className="col-3" style={{textAlign:'right'}}><p>your best score: {localStorage.getItem("BestScore") !== null ? localStorage.getItem("BestScore"): 0}</p></div>
        

      </div>
      <div className="game-area">
        <Snake snakeDots={this.state.snakeDots}/>
        <Food dot={this.state.food}/>
      </div>

      
    </div>
    );
  }
}

export default App;
