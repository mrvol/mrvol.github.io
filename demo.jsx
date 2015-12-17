
var Step = React.createClass({
  getInitialState(){
    return {pass: false}
  },
  updateStateHandler(value){
    this.setState({pass: value});
  },
  render() {
    var color = this.state.pass ? "http://placehold.it/250/ff4b8a/000000" : "http://placehold.it/250/999999/000000";
    return (
      <div className="text-center">
      <img className="img-circle" src={color} alt="Generic placeholder image" width="140" height="140" />
      <h2>STEP {this.props.step}</h2>
      <p>{this.props.text}</p>
      </div>);
    }
  });

  var SelectStepOne = React.createClass({
    onChangeHandler(e){
      this.props.changeHandler(1, e.target.value);
    },
    render(){
      return (<div className="form-group">
      <label forHtml="select-game">Choice a game:</label>
      <select id="select-game" name="select-game" className="form-control" onChange={this.onChangeHandler}>
      <option defaultValue="selected">Empty</option>
      <option>Doom</option>
      <option>Duke</option>
      <option>Quake</option>
      </select>
      </div>);
    }
  });


  var SelectStepTwo = React.createClass({
    getInitialState(){
      return {input: false, value: 'Other'}
    },
    onChangeHandler(e){
      this.setState({value: e.target.value})
      if(e.target.localName == 'select'){
        this.setState({input: e.target.value === 'Other' });
      }
      this.props.changeHandler(2, e.target.value);
    },
    render(){
      var input = <div className="form-group">
      <label forHtml="input-player">Enter name player:</label>
      <input type="text" id="input-player" name="input-player" className="form-control" onChange={this.onChangeHandler}/>
      </div>
      return (<div>
        <div className="form-group">
        <label forHtml="select-player">Choice a player:</label>
        <select id="select-player" name="select-player" className="form-control" onChange={this.onChangeHandler}>
        <option defaultValue="selected">Empty</option>
        <option>Barack</option>
        <option>George</option>
        <option>Bill</option>
        <option>Other</option>
        </select>
        </div>
        {this.state.input ? input : null}
        </div>);
      }
    });


    var SelectStepThree = React.createClass({
      onChangeHandler(e){
        this.setState({'send': Boolean(e)});
        this.props.changeHandler(3, e.target.value);
      },
      render(){
        var sendEnable = <input type="submit" name="send" value="Send" className="btn btn-primary" />;
        var sendDisable = <input type="submit" name="send" value="Send" className="btn btn-primary" disabled="disabled"/>;
        return (<div className="form-group">
        <label forHtml="bet">Enter your bet:</label>
        <div className="row">
        <div className="col-lg-8 col-md-8 col-sm-8">
        <input type="integer" id="bet" name="bet" className="form-control" onChange={this.onChangeHandler} type="number" step="0.01" min="0.01"/>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4">
        {this.props.getStateSteps() ? sendEnable : sendDisable }
        </div>
        </div>
        </div>);
      }
    });

    var Form = React.createClass({
      getInitialState(){
          return {steps: {1: false, 2: false, 3: false}, post: [], form_values: {}};
      },
      handleSubmit(e){
        e.preventDefault();
        // console.log(e);
        this.setState({post: this.state.post.concat([JSON.stringify(this.state.form_values)])});
        // return false;
      },
      canSend(){
          var vals = Object.keys(this.state.steps).map(key => this.state.steps[key]);
          for (var i = 0; i < vals.length; i++) {
                  if (!vals[i]) return false;
              }
          return true;
      },
      completeStep(step, value){
        var step_done = value && value !== 'Empty' && value !== 'Other';

        var old_steps = this.state.steps;
        old_steps[step] = step_done;
        var old_form_values = this.state.form_values;
        old_form_values[step] = value;

        this.setState({steps: old_steps, form_values: old_form_values});
        this.refs[step].updateStateHandler(step_done);
      },
      render(){
        var posts = this.state.post.map(function(el, i){
                        return <p key={i} dangerouslySetInnerHTML={{__html: el}} />;
                    });

        return (<div className="row">
        <form onSubmit={this.handleSubmit} method="POST" action=".">
        <div className="col-lg-4 col-md-4 col-sm-4">
        <Step step="1" text="Make your choice" ref="1"/>
        <SelectStepOne changeHandler={this.completeStep} />
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4">
        <Step step="2" text="Make your choice" ref="2"/>
        <SelectStepTwo changeHandler={this.completeStep} />
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4">
        <Step step="3" text="Enter a bet" ref="3"/>
        <SelectStepThree changeHandler={this.completeStep} getStateSteps={this.canSend}/>
        </div>
        </form>
        <div className="col-lg-12 col-md-12 col-sm-12 text-center">
        <h2>You've posted:</h2>
        <div>{posts.length ? posts : 'Nothing yet'}</div>
        </div>
        </div>);
      }
    });
    ReactDOM.render(
      <Form />,
      document.getElementById('form')
    );
