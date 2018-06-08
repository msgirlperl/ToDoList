import React from 'react';

class TaskGroup extends React.Component {

  constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
  }

  // notify a task group has been clicked
  handleClick = (event) => {
    this.props.groupClick(this.props.groupName);
  }

  render() {
    const complete = this.props.tasks.filter(task => task.completedAt).length;

    return (
      <div className="row group">
        <div className="col-sm-1">
          <i className="fas fa-caret-right arrow"></i>
        </div>
        <div onClick={this.handleClick} className='col-sm-8'>
          <div className='groupName'>{this.props.groupName}</div>
          <div>{complete} OF {this.props.tasks.length} TASKS COMPLETE</div>
        </div>
      </div>
    )
  }
}

export default TaskGroup;
