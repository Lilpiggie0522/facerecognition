import React, {Component} from 'react';
import SignIn from './components/signIn/SignIn';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
import './App.css';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Register from './components/register/Register';
import Clarifai from "clarifai";

// const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'f95f77189da948d088f8aa3a93132cef'
});




const particlesOptions = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 10,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 80,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 300,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 800,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 800,
        "size": 80,
        "duration": 2,
        "opacity": 0.8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    }
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //   .then(response=>response.json())
  //   .then(data=>console.log(data));
  // }
loadUser = (data) => {
  this.setState({user:{
    id:data.id,
    name:data.name,
    email:data.email,
    entries:data.entries,
    joined:data.joined
  }})
}

calculateFaceLocation = (data)=>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(width,height);
  return {
    leftCol: width*clarifaiFace.left_col,
    rightCol: width-(width*clarifaiFace.right_col),
    topRow: height*clarifaiFace.top_row,
    bottomRow: height-(height*clarifaiFace.bottom_row)
  }
}

displayFacebox = (box) =>{
  console.log(box);
  this.setState({box:box}); 
}

  onInputChange = (event)=>{
    this.setState({input:event.target.value})
  }

  onSubmit = ()=> {
    console.log('click');
    this.setState({imageUrl:this.state.input});
    console.log(this.state.input)
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then((response)=>{
      //  console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      if(response){
        fetch('http://localhost:3000/image',{
          method:'put',
          headers:{'Content-type':'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
      }
       this.displayFacebox(this.calculateFaceLocation(response));
      })
      .catch(err=>console.log(err));
    
  }

  onRouteChange = (route) => {
    this.setState({route:route})
    if(route==='signout'){
      this.setState({isSignedIn:false})
    }
    else if(route==='home'){
      this.setState({isSignedIn:true})
    }
  }

 
  render(){
    const {isSignedIn, imageUrl, route, box, user}=this.state;
  return (
    <div className="App">
      <Particles className='particles' params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

      {route === 'home'?
      
        <div>
        <Logo />
        <Rank userName={user.name} userEntry={user.entries} />
        <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit ={this.onSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      :(
        route==='signin'? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      )
      }
    </div>
  
  )}
}

export default App;
