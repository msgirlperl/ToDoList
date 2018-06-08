import React, {Component} from 'react';
import Completed from '../assets/Completed.svg';
import Incomplete from '../assets/Incomplete.svg';
import Locked from '../assets/Locked.svg';

import Log from '../Utils/Utils'

/*
Create a grouped task list with task dependencies

1. Build a task list UI in React using included design and SVG assets
2. The top level should show a list of task groups w/ # of tasks inside
3. Clicking a group should display the list of all tasks for that group
4. Tasks remain locked until all dependent tasks are complete
5. Clicking a task should mark it as complete or incomplete, unless the task is locked
6. Dependencies that don't point to a loaded task should be ignored
*/

class Task extends Component  {

  // Returns the icon to display in front of the task, based on task status
  getIcon() {
    if (this.props.task.isLocked){
      return <img src={Locked} alt="Locked" />;
    }
    if (this.props.task.completedAt){
      return <img src={Completed} alt="Incomplete" />;
    }
    return <img src={Incomplete} alt="Incomplete" />;
  };

  // Returns the CSS class to use for the task item, based on task status
  getClassName() {
    if (this.props.task.isLocked){
      return "locked";
    }
    if (this.props.task.completedAt){
      return 'completed'
    }
  };

  // notify the task has been clicked
  toggleComplete = (event) => {
    this.props.taskClick(this.props.task.id);
  }

  constructor(props) {
    super(props);
    this.toggleComplete = this.toggleComplete.bind(this);

    if (!this.props.task){
      Log.log('No task was passed!');
    }

    this.state = {
        locked:this.props.task.isLocked,
        completedAt:this.props.task.completedAt
      };
  }

  render() {
    return (
      <div onClick={this.toggleComplete} className="row task" key={this.props.task.id}>
          <div className="col-sm-2 icon" >{this.getIcon()}</div>
          <div className="col-sm-10 groupName"><div className={this.getClassName()}>{this.props.task.task}</div></div>
      </div>
    )
  }
}

export default Task;
